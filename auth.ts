import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import { getUniversityByEmailDomain } from '@/lib/utils/university'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Validate email domain exists in universities database
        const university = await getUniversityByEmailDomain(email)
        if (!university) {
          throw new Error('Your university email domain is not registered. Please contact support or request to add your university.')
        }

        const db = await getDatabase()
        const user = await db.collection<User>('users').findOne({
          email: email.toLowerCase()
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Check if user is banned
        if (user.isBanned) {
          throw new Error('Your account has been banned. Please contact support.')
        }

        // Return user data for session
        return {
          id: user._id!.toString(),
          email: user.email,
          name: user.name,
          indexNumber: user.indexNumber,
          registrationNumber: user.registrationNumber,
          universityId: user.universityId.toString(),
          role: user.role || 'user', // Default to 'user' if role is not set
          image: user.profilePicture || user.image || null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.name = (user as any).name
        token.indexNumber = (user as any).indexNumber
        token.registrationNumber = (user as any).registrationNumber
        token.universityId = (user as any).universityId
        token.role = (user as any).role || 'user'
        token.image = (user as any).image
      } else if (token.id) {
        // Refresh user data from database periodically
        // Only refresh if it's been a while (every 5 minutes) or if trigger is 'update'
        const lastRefresh = (token as any).lastDataRefresh || 0
        const now = Date.now()
        const fiveMinutes = 5 * 60 * 1000
        const shouldRefresh = trigger === 'update' || !token.name || (now - lastRefresh) > fiveMinutes

        if (shouldRefresh) {
          try {
            const db = await getDatabase()
            const user = await db.collection<User>('users').findOne({
              _id: new ObjectId(token.id as string)
            }, {
              projection: {
                name: 1,
                indexNumber: 1,
                registrationNumber: 1,
                profilePicture: 1,
                image: 1,
                role: 1
              }
            })
            if (user) {
              token.name = user.name
              token.indexNumber = user.indexNumber
              token.registrationNumber = user.registrationNumber
              token.image = user.profilePicture || user.image || null
              token.role = user.role || 'user'
                ; (token as any).lastDataRefresh = now
            }
          } catch (error) {
            // If database query fails, continue with existing token data
            // This prevents connection errors from breaking the session
            console.error('Failed to refresh user data in JWT callback:', error)
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.name = (token.name as string) || session.user.name
          ; (session.user as any).indexNumber = token.indexNumber
          ; (session.user as any).registrationNumber = token.registrationNumber
          ; (session.user as any).universityId = token.universityId
          ; (session.user as any).role = token.role || 'user'
        session.user.image = token.image as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  }
})

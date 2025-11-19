import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { User } from '@/lib/models/User'
import { University } from '@/lib/models/University'

// GET /api/contributors - Get all contributors (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Fetch all users who are contributors (either contributor or core-contributor)
    const contributors = await db
      .collection<User>('users')
      .find(
        {
          contributorType: { $in: ['contributor', 'core-contributor'] },
          isBanned: false // Exclude banned users
        },
        { projection: { password: 0 } } // Exclude password
      )
      .sort({ contributedAt: -1 }) // Sort by contribution date, newest first
      .toArray()

    // Fetch university info for each contributor
    const contributorsWithUniversity = await Promise.all(
      contributors.map(async (contributor) => {
        let university = null
        if (contributor.universityId) {
          university = await db.collection<University>('universities').findOne({
            _id: contributor.universityId
          })
        }

        return {
          _id: contributor._id?.toString(),
          name: contributor.name,
          email: contributor.email,
          profilePicture: contributor.profilePicture,
          bio: contributor.bio,
          contributorType: contributor.contributorType,
          contributedAt: contributor.contributedAt,
          university: university
            ? {
                name: university.name,
                district: university.district,
                province: university.province
              }
            : null,
          linkedin: contributor.linkedin,
          github: contributor.github
        }
      })
    )

    // Separate core contributors and regular contributors
    const coreContributors = contributorsWithUniversity.filter(
      (c) => c.contributorType === 'core-contributor'
    )
    const regularContributors = contributorsWithUniversity.filter(
      (c) => c.contributorType === 'contributor'
    )

    return NextResponse.json({
      contributors: {
        core: coreContributors,
        regular: regularContributors
      },
      total: contributorsWithUniversity.length
    })
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contributors' },
      { status: 500 }
    )
  }
}


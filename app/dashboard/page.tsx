import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioLinkCard } from '@/components/portfolio-link-card'
import { getDatabase } from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'
import { ObjectId } from 'mongodb'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'

export default async function Dashboard() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const db = await getDatabase()
  const userId = new ObjectId(session.user.id)

  // Get stats
  const projectsCount = await db.collection<Project>('projects').countDocuments({
    userId: userId
  })

  const collaborationsCount = await db.collection<Project>('projects').countDocuments({
    'teamMembers.userId': session.user.id,
    userId: { $ne: userId }
  })

  // Calculate total views across all user's projects
  const totalViewsResult = await db.collection<Project>('projects').aggregate([
    { $match: { userId: userId } },
    { $group: { _id: null, totalViews: { $sum: '$views' } } }
  ]).toArray()
  const totalViews = totalViewsResult[0]?.totalViews || 0

  // Get recent projects
  const recentProjects = await db.collection<Project>('projects')
    .find({ userId: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  const portfolioUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile/${session.user.id}`

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}!</p>
        </div>

        {/* Portfolio Link Card */}
        <PortfolioLinkCard userId={session.user.id} portfolioUrl={portfolioUrl} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-base">{session.user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{session.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Index Number</p>
                <p className="text-base">{(session.user as any).indexNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Registration Number</p>
                <p className="text-base">{(session.user as any).registrationNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Projects</span>
                <span className="text-2xl font-bold">{projectsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Collaborations</span>
                <span className="text-2xl font-bold">{collaborationsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Views</span>
                <span className="text-2xl font-bold">{totalViews}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest projects and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No projects yet. Start by creating your first project!
              </p>
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project._id!.toString()}
                    href={`/projects/${project._id!.toString()}`}
                    className="block p-4 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{project.title}</h3>
                          <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">{project.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          <span>{project.views} views</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

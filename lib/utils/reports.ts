import { getDatabase } from '@/lib/mongodb'
import { ProjectReport } from '@/lib/models/ProjectReport'
import { ObjectId } from 'mongodb'
import { REPORT_REASONS, REPORT_COOLDOWN_HOURS, getReasonLabel as getReasonLabelFromConstants } from '@/lib/constants/reports'

/**
 * Get all predefined report reasons
 */
export function getReportReasons() {
  return REPORT_REASONS
}

/**
 * Check if a user can report a project
 * - User cannot report their own project
 * - User cannot report the same project within cooldown period
 */
export async function canUserReport(
  userId: string,
  projectId: string
): Promise<{ canReport: boolean; reason?: string }> {
  const db = await getDatabase()

  // Get project to check if user is the owner
  const project = await db.collection('projects').findOne({
    _id: new ObjectId(projectId)
  })

  if (!project) {
    return { canReport: false, reason: 'Project not found' }
  }

  // Check if user is the project owner
  if (project.userId.toString() === userId) {
    return { canReport: false, reason: 'You cannot report your own project' }
  }

  // Check for recent reports from this user for this project
  const cooldownDate = new Date()
  cooldownDate.setHours(cooldownDate.getHours() - REPORT_COOLDOWN_HOURS)

  const recentReport = await db.collection<ProjectReport>('projectReports').findOne({
    projectId: new ObjectId(projectId),
    reporterId: new ObjectId(userId),
    createdAt: { $gte: cooldownDate }
  })

  if (recentReport) {
    return {
      canReport: false,
      reason: `You have already reported this project recently. Please wait ${REPORT_COOLDOWN_HOURS} hours before reporting again.`
    }
  }

  return { canReport: true }
}

/**
 * Get badge variant for report status
 */
export function getReportStatusBadge(status: ProjectReport['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'pending':
      return 'default'
    case 'reviewed':
      return 'secondary'
    case 'resolved':
      return 'outline'
    case 'dismissed':
      return 'secondary'
    default:
      return 'outline'
  }
}

/**
 * Get status label for display
 */
export function getStatusLabel(status: ProjectReport['status']): string {
  switch (status) {
    case 'pending':
      return 'Pending Review'
    case 'reviewed':
      return 'Under Review'
    case 'resolved':
      return 'Resolved'
    case 'dismissed':
      return 'Dismissed'
    default:
      return status
  }
}

/**
 * Get reason label by value (re-export from constants)
 */
export function getReasonLabel(value: string): string {
  return getReasonLabelFromConstants(value)
}


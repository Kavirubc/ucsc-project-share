'use server'

import { getDatabase } from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'
import { User } from '@/lib/models/User'
import { ObjectId } from 'mongodb'

export async function getProjectData(id: string) {
    if (!ObjectId.isValid(id)) {
        throw new Error('Invalid project ID')
    }

    const db = await getDatabase()
    const project = await db.collection<Project>('projects').findOne({
        _id: new ObjectId(id)
    })

    if (!project) {
        throw new Error('Project not found')
    }

    const owner = await db.collection<User>('users').findOne({
        _id: project.userId
    })

    await db.collection<Project>('projects').updateOne(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } }
    )

    return { project, owner }
}


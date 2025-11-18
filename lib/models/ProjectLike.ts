import { ObjectId } from 'mongodb'

export interface ProjectLike {
  _id?: ObjectId
  userId: ObjectId // Reference to User who liked the project
  projectId: ObjectId // Reference to Project being liked
  createdAt: Date
}


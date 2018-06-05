import type { Post } from './Post'
import type { Project } from './Project'

export type User = {
  id: string,
  name: string,
  posts?: Array<Post>,
  projects?: Array<Project>,
  secret: string
}

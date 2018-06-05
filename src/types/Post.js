import type { Raw } from './Raw'
import type { Project } from './Project'

export type PostMeta = {
  id?: string,
  title: string,
  slug: string,
  excerpt: string
}

export type Version = {
  id: string,
  raw: Raw
}

export type Document = {
  id: string,
  versions: Array<Version>,
  raw: Raw
}

export type Post = {
  id: string,
  document: Document,
  postMeta: PostMeta,
  project: Project
}

export type PostsQuery = {
  data: {
    allPosts: Array<Post>
  },
  variables: { id: string },
  fetchMore: any
}

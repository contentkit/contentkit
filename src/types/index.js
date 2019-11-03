import { EditorState } from 'draft-js'

export type Raw = {
  blocks: Array<{key: string, text: string}>,
  blockMap?: any
}

export type Domain = {
  id?: string,
  name: string
}

export type Project = {
  id: string,
  name: string,
  domain?: Domain
}

export type ProjectQuery = {
  data: {
    Project: Project
  },
  variables: { id: string }
}

export type ProjectsQuery = {
  data: {
    allProjects: Array<Project>
  },
  variables: { id: string }
}

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

export type User = {
  id: string,
  name: string,
  posts?: Array<Post>,
  projects?: Array<Project>,
  secret: string
}

export type LocalStorageVersion = {
  key: string,
  timestamp: string,
  raw: string
}

export type Adapter = {
  getVersions: () => Array<LocalStorageVersion>,
  restore: (key: string) => void
}

// export type FetchMore = ({
//   variables: any,
//   updateQuery: (previousResult: any, nextResult: any) => Promise<any>
// }) => void

export type Client = {
  query: (args: any) => void,
  mutate: (args: any) => void
}

export type SetEditorState = (editorState: EditorState) => void

export type PostsAggregateVariables = {
  limit?: number
  offset?: number
  query?: string
  projectId?: string
}

export type SelectProject = (projectId: string) => void
export type SetSearchLoadingState = (isLoading: boolean) => void

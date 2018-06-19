// @flow
import type { EditorState } from 'draft-js'

export type { Raw } from './Raw'
export type { Domain, Project, ProjectsQuery, ProjectQuery } from './Project'
export type { Version, Document, Post, PostMeta, PostsQuery } from './Post'
export type { User } from './User'

export type LocalStorageVersion = {
  key: string,
  timestamp: string,
  raw: string
}

export type Adapter = {
  getVersions: () => Array<LocalStorageVersion>,
  restore: (key: string) => void
}

export type FetchMore = ({
  variables: any,
  updateQuery: (previousResult: any, nextResult: any) => Promise<any>
}) => void

export type Client = {
  query: (args: any) => void,
  mutate: (args: any) => void
}

export type SetEditorState = (editorState: EditorState) => void

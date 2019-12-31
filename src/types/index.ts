import { EditorState } from 'draft-js'
import { QueryResult } from '@apollo/react-common'

export namespace GraphQL { 
  export type Origin = {
    id: string,
    name: string
  }

  export type Tag = {
    id: string
    name: string
    description: string
    slug: string
  }
  
  export type User = {
    id: string
    email: string
    name: string
    secret: string
    projects: Project[]
  }
  
  export type Image = {
    id: string
    url: string
  }
  
  export type Project = {
    id: string
    name: string
    origins: Origin[]
  }
  
  export type Post = {
    id: string
    created_at: string
    published_at: string
    title: string
    slug: string
    status: string
    excerpt: string
    raw: any
    encoded_html: string
    cover_image_id: string,
    images: Image[],
    project: Project,
    posts_tags: { tag: Tag }[]
  }

  // post query
  export type PostQueryData = { posts: Post[] }
  export type PostQueryVariables = { id: string }
  export type PostQueryResult = QueryResult<PostQueryData, PostQueryVariables>


  // posts aggregate
  export type PostsAggregateQueryVariables = { limit?: number, offset?: number, query?: string, projectId?: string }
  export type PostsAggregateQueryData = {
    nodes: Pick<Post, 'id' | 'created_at' | 'published_at' | 'title' | 'slug' | 'status' | 'excerpt' | 'posts_tags' | 'project'>[],
    aggregate: {
      count: number
    }
  }
  export type PostsAggregateQueryResult = QueryResult<PostsAggregateQueryData, PostQueryVariables>

  // project query
  export type ProjectQueryVariables = { id: string }
  export type ProjectQueryData = Pick<Project, 'id' | 'name' | 'origins'>
  export type ProjectQueryResult = QueryResult<ProjectQueryData, ProjectQueryVariables>

  // projects query
  export type ProjectsQueryVariables = {}
  export type ProjectsQueryData = { projects: Pick<Project, 'id' | 'name'>[] }
  export type ProjectsQueryResult = QueryResult<ProjectsQueryData, ProjectsQueryVariables>

  // user query
  export type UserQueryVariables = {}
  export type UserQueryData = { users: Pick<User, 'id' | 'email' | 'name' | 'secret' | 'projects'>[] }
  export type UserQueryResult = QueryResult<UserQueryData, UserQueryVariables>

  // tag query
  export type TagQueryVariables = { postId: string }
  export type TagQueryData = { posts_tags: { tag: Pick<Tag, 'id' | 'name' | 'description'> }[] }
  export type TagQueryResult = QueryResult<TagQueryData, TagQueryVariables>

  export type UpdateDocumentMutationVariables = { id: string, raw: any, encodedHtml: string }
  
  export type CreateOriginMutationVariables = { name: string, projectId: string, userId: string }
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

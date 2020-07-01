import React from 'react'
import gql from 'graphql-tag'
import { useQuery, useApolloClient } from '@apollo/client'
import { GraphQL } from '../types'
import set from 'lodash.set'

export const PROJECTS_QUERY = gql`
  query {
    projects {
      id
      name
    }
  }
`

export const POSTS_AGGREGATE_QUERY = gql`
  query (
    $limit: Int, 
    $offset: Int, 
    $query: String,
    $projectId: String
  ) {
    posts_aggregate(
      limit: $limit,
      offset: $offset,
      where: {
        project_id: {
          _eq: $projectId
        },
        title: {
          _ilike: $query
        }
      },
      order_by: {
        published_at: desc_nulls_last
      }
    ) {
      aggregate {
        count
      }
      nodes {
        id
        created_at
        published_at
        title
        slug
        status
        excerpt
        posts_tags {
          tag {
            id
            name
          }
        }
        project {
          id
          name
        }
      }
    }
  }
`

export const POST_QUERY = gql`
  query ($id: String!) {
    posts (where: { id: { _eq: $id } }) {
      id
      created_at
      published_at
      title
      slug
      status
      excerpt
      raw
      encoded_html
      cover_image_id
      images {
        id
        url
      }
      project {
        id
      }
    }
  }
`

export const PROJECT_QUERY = gql`
  query ($id: String!) {
    projects(where: { id: { _eq: $id } }) {
      id
      name
      origins {
        id
        name
      }
    }
  }
`

export const USER_QUERY = gql`
  query {
    users {
      id
      email
      name
      secret
      projects {
        id
        name
      }
    }
  }
`

export const USER_AUTH_QUERY = gql`
  query {
    users {
      id
    }
  }
`


export const TAG_QUERY = gql`
  query($postId: String!) {
    posts_tags(where: { post_id: { _eq: $postId } }) {
      tag {
        id
        name
        description
        slug
      }
    }
  }
`

export const ALL_TAGS_QUERY = gql`
  query($userId: String!) {
    tags(where: { user_id: { _eq: $userId } }) {
      id
      name
      description
      slug
    }
  }
`

export const SETTINGS_QUERY = gql`
  query {
    settings {
      user_id
      property_name,
      property_value
    }
  }
`

export function useSettingsQuery () {
  const ref = React.useRef()
  const client = useApolloClient()

  const query = useQuery(SETTINGS_QUERY)
  return React.useMemo(() => {
    const setting = {
      dashboard: {
        selected_project_id: null
      }
    }
    if (query.loading) {
      return setting
    }

    const settings = query?.data?.settings || []

    if (!settings.length) {
      const { projects } = client.cache.readQuery({
        query: PROJECTS_QUERY
      })
      setting.dashboard.selected_project_id = projects[0]?.id
    }

    return settings.reduce((acc, { property_name, property_value }) => {
      set(acc, property_name, property_value)
      return acc
    }, setting) 
  }, [query])
}

export function useUserQuery (options = {}): GraphQL.UserQueryResult {
  return useQuery(USER_QUERY, options)
}

export function useProjectsQuery (): GraphQL.ProjectsQueryResult {
  return useQuery(PROJECTS_QUERY)
}

export function usePostsAggregateQuery (options): GraphQL.PostsAggregateQueryResult {
  return useQuery(POSTS_AGGREGATE_QUERY, options)
}

export function useTagQuery (options): GraphQL.TagQueryResult {
  return useQuery(TAG_QUERY, options)
}
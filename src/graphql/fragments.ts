import gql from 'graphql-tag'


export const TASKS_FRAGMENT = gql`
  fragment task on tasks {
    id 
    user_id
    project_id
    status
    created_at
    updated_at
    metadata
    storage_key
  }
`
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'

const SAVE_POST = gql`
  mutation(
    $id: String!
    $title: String
    $status: post_status!
    $published_at: timestamp
    $project_id: String
  ) {
    update_posts (
      _set: {
        id: $id
        title: $title
        status: $status
        published_at: $published_at
        project_id: $project_id
      },
      where: { id: { _eq: $id } }
    ) {
      returning { 
        id
      }
    }
  }
`

export function useOnSave () {
  const [mutate, data] = useMutation(SAVE_POST)

  const onSave = ({ id, title, status, published_at, project_id }) => mutate({
    variables: {
      id,
      title,
      status, 
      published_at,
      project_id
    }
  })

  return onSave
}

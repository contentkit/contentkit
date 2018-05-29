import gql from 'graphql-tag'

export const PROJECT_QUERY = gql`
  query ($id: ID!) {
    Project(id: $id) {
      id
      name
      domains {
        id
        name
      }
    }
  }
`

export const DELETE_DOMAIN = gql`
  mutation ($id: ID!) {
    deleteDomain (
      id: $id
    ) {
      id
    }
  }
`

export const CREATE_DOMAIN = gql`
  mutation ($projectId: ID!, $name: String!) {
    createDomain (
      projectId: $projectId,
      name: $name
    ) {
      name
      id
      project {
        id
      }
    }
  }
`

export const styles = theme => ({
  wrapper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top: `${50}%`,
    left: `${50}%`,
    transform: `translate(-${50}%, -${50}%)`,
    height: '400px',
    width: '500px',
    '&:focus': {
      'outline': 'none'
    }
  },
  modal: {
    '&:focus': {
      'outline': 'none'
    }
  }
})

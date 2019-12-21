import React from 'react'
import { Query } from 'react-apollo'
import { graphql } from '@apollo/react-hoc'
import { POSTS_AGGREGATE_QUERY, PROJECTS_QUERY } from '../../graphql/queries'

import PropTypes from 'prop-types'

const withData = Component =>
  class extends React.Component {
    static propTypes = {
      user: PropTypes.object,
      selectedProject: PropTypes.string,
      setEditorState: PropTypes.func,
      selectProject: PropTypes.func,
      client: PropTypes.object,
      render: PropTypes.func
    }
  
    render () {
      const { postsAggregateVariables } = this.props
      const variables = {
        ...postsAggregateVariables,
        query: postsAggregateVariables.query ? `%${postsAggregateVariables.query}%` : '%'
      }
      return (
        <Query query={POSTS_AGGREGATE_QUERY} variables={variables}>
          {(posts) => (
            <Query query={PROJECTS_QUERY}>
              {(projects) => (
                <Component
                  posts={posts}
                  projects={projects}
                  {...this.props}
                />
              )}
            </Query>
          )}
        </Query>
      )
    }
  }

export default withData

// export default [
//   graphql(POSTS_AGGREGATE_QUERY, {
//     options: ({ postsAggregateVariables }) => ({
//       variables: {
//         ...postsAggregateVariables,
//         query: postsAggregateVariables.query ? `%${postsAggregateVariables.query}%` : '%'
//       }
//     })
//   }),
//   graphql(PROJECTS_QUERY)
// ]

import React from 'react'
import { Query } from 'react-apollo'

import { FEED_QUERY, PROJECTS_QUERY } from '../../graphql/queries'

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
      return (
        <Query query={FEED_QUERY} variables={this.props.feedVariables}>
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

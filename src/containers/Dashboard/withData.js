// @flow
import React from 'react'
import { Query } from 'react-apollo'

import { FEED_QUERY, PROJECTS_QUERY } from '../../graphql/queries'

import debounce from 'lodash.debounce'
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

    state = {
      variables: {
        limit: 10,
        offset: 0,
        query: '',
        projectId: undefined
      }
    }

    handleSearch = debounce(({ query }: { query: string }) => {
      this.setState({ query })
    }, 300)

    updateVariables = variables => {
      window.requestIdleCallback(() =>
        this.setState(prevState => ({
          variables: {
            ...prevState.variables,
            ...(variables || {})
          }
        }))
      )
    }

    render () {
      const { user } = this.props
      const variables = {
        ...this.state.variables,
        projectId: this.props.selectedProject
      }
      return (
        <Query query={FEED_QUERY} variables={variables}>
          {(feed) => (
            <Query query={PROJECTS_QUERY}>
              {(projects) => (
                <Component
                  updateVariables={this.updateVariables}
                  variables={variables}
                  handleSearch={this.handleSearch}
                  feed={feed}
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

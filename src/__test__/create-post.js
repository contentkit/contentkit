import React from 'react'
import './enzyme'
import CreatePost from '../containers/App/components/CreatePost/CreatePost'
import { getSelectedProject } from '../containers/App/util'
import { mount, configure } from 'enzyme'
import SelectProject, { ProjectListItem } from '../containers/App/components/SelectProject'
import { withStore, appState } from '../store/store'
import sinon from 'sinon'
import CreatePostInput from '../containers/App/components/CreatePost/CreatePostInput'

const project = {
  id: 'cjh0y8am9i21s010137h3cwcv',
  name: 'fancy-sun-9777',
  __typename: 'Project'
}

const projects = {
  projects: {
    allProjects: [project, { id: '1234', name: 'other-project' }]
  }
}
const mockProps = {
  createPost: {
    loading: false,
    result: null,
    mutate: () => {}
  },
  createProject: {
    loading: false,
    result: null,
    mutate: () => {}
  },
  user: '1',
  project: getSelectedProject({ projects, app: appState }),
  projects: {
    allProjects: [project]
  }
}

const getState = elem => elem.state().vdom.props
/* eslint-disable */
const _CreatePost = withStore('app')(CreatePost)
const _SelectedProject = withStore('app')(SelectProject)

describe('SelectedProject', () => {
  it('renders', () => { 
    // sinon.spy(SelectProject.prototype, 'handleListItemClick')
    const wrapper = mount(<_SelectedProject selectedProject={project} allProjects={[project]} />)
    const elem = wrapper.find('SelectProject')
    const list = elem.find('ProjectListItem')
    list.simulate('click')
    let item = elem.find('MenuItem')
    console.log(item.exists())
    console.log(wrapper.debug())
    const anchorEl = elem.instance().props.app.get('project').get('anchorEl')
    expect(anchorEl).not.toBe(undefined)
    wrapper.unmount()
  })
})

describe('CreatePost', () => {
  it('renders', () => {
    const output = mount(<_CreatePost {...mockProps} />).at(0).at(0)
    let createPost = output.find('CreatePost')
    createPost.instance().handleChange({ target: { value: 'lorem' } })
    expect(createPost.instance().props.app.get('title')).toEqual('lorem')
  })
})

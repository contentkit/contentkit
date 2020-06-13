import React from 'react'
import Haikunator from 'haikunator'
import { makeStyles } from '@material-ui/styles'
import { AppWrapper } from '@contentkit/components'
import ProjectModal from './components/ProjectModal'
import ProjectsList from './components/ProjectsList'
import Button from '../../components/Button'
import { useMutation, useQuery } from '@apollo/react-hooks'

import { PROJECTS_QUERY, useUserQuery } from '../../graphql/queries'
import { useCreateProjectMutation, useDeleteProjectMutation, useUpdateProjectMutation } from '../../graphql/mutations'

const haikunator = new Haikunator()

const useStyles = makeStyles(theme => ({
  container: {
    width: '660px',
    margin: '2em auto',
  },
  inner: {
    margin: '2em 0'
  }
}))

function Projects (props) {
  const classes = useStyles(props)
  const [activeProject, setActiveProject] = React.useState(null)
  const [open, setOpen] = React.useState(false)

  const {
    deleteProject,
    createProject,
    updateProject,
    users,
    projects
  } = props

  const onClick = activeProject => {
    setActiveProject(activeProject)
    setOpen(true)
  }

  const onClose = () => {
    console.log('onClose')
    setActiveProject(null)
    setOpen(false)
  }


  const onSaveProject = (variables) => {
    onClose()
    updateProject.mutate(variables)
  }

  const onDeleteProject = () => {
    onClose()
    deleteProject.mutate({ id: activeProject })
  }

  const onCreateProject = () => {
    createProject.mutate({
      name: haikunator.haikunate(),
      userId: users.data.users[0].id
    })
  }

  return (
    <AppWrapper
      sidebarProps={{}}
    >
      <ProjectModal
        {...props}
        activeProject={activeProject}
        open={open}
        onClose={onClose}
        onDeleteProject={onDeleteProject}
        onSaveProject={onSaveProject}
      />
      <div className={classes.container}>
        <div className={classes.inner}>
          <ProjectsList
            allProjects={projects?.data?.projects}
            onClick={onClick}
          />
        </div>
        <Button
          onClick={onCreateProject}
        >
          New Project
        </Button>
      </div>
    </AppWrapper>
  )
}

function ProjectsMutations (props) {
  const userQuery = useUserQuery()
  const createProject= useCreateProjectMutation()
  const deleteProject = useDeleteProjectMutation()
  const updateProject = useUpdateProjectMutation()
  const projectsQuery = useQuery(PROJECTS_QUERY)

  if (userQuery.loading) {
    return false
  }
    
  if (projectsQuery.loading) {
    return false
  }

  const componentProps = {
    users: userQuery,
    projects: projectsQuery,
    updateProject,
    createProject,
    deleteProject
  }

  return (
    <Projects
      {...props}
      {...componentProps}
    />
  )
}

export default ProjectsMutations


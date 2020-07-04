import React from 'react' 
import { useQuery } from '@apollo/client'
import { Toolbar, Box, Fade, Avatar, IconButton, Collapse, Typography, Grid, Button, Paper, Card, CardContent, CardActions, CardHeader } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { makeStyles } from '@material-ui/styles'
import TopBar from '../../components/TopBar'
import { useSnackbar } from 'notistack'
import ProjectSelect from '../../components/ProjectSelect'
import { TASKS_QUERY } from '../../graphql/queries'
import { useInsertTask, useDeleteTask } from '../../graphql/mutations'
import { Delete, Error, Cached, CheckCircle, ExpandMore, ExpandLess } from '@material-ui/icons'

export const StatusIcons = {
  PENDING: <Cached />, 
  DONE: <CheckCircle />,
  ERROR: <Error />
}

const useStyles = makeStyles(theme => ({
  paper: {
    boxSizing: 'border-box',
    width: '100%',
    height: 'calc(100vh - 120px)',
    // @ts-ignore
    // @ts-ignore
    padding: theme.spacing(3)
  },
  count: {
    // @ts-ignore
    marginRight: theme.spacing(4)
  },
  tasksContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // @ts-ignore
    padding: theme.spacing(2),
  },
  taskCard: {
    // @ts-ignore
    marginRight: theme.spacing(2),
    // @ts-ignore
    marginBottom: theme.spacing(2),
    width: '100%'
  },
  button: {
    color: '#fff',
    backgroundColor: '#48BB78'
  }
}))


function TaskCard (props) {
  const { task, className, onDelete } = props
  const [expanded, setExpanded] = React.useState(false)

  const toggleExpand = evt => setExpanded(exp => !exp)

  const onDownload = () => {
    const a = document.createElement('a')
    a.href = `https://s3.amazonaws.com/contentkit/${task.storage_key}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <Card raised className={className}>
      <CardHeader
        avatar={(
          <Avatar>
            {StatusIcons[task.status]}
          </Avatar>
        )}
        title={task.project.name}
        subheader={task.status}
        action={(
          <Toolbar>
            <IconButton onClick={toggleExpand}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            <IconButton onClick={onDelete}>
              <Delete />
            </IconButton>
          </Toolbar>
        )}
      />
      <Collapse in={expanded}>
        <CardContent>
        </CardContent>
        <CardActions>
           
          <Button variant='outlined' onClick={onDownload}>Download</Button>
        </CardActions>
      </Collapse>
    </Card>
  )
}

function Migrations (props) {
  const { rootQuery } = props
  const classes = useStyles(props)

  const { enqueueSnackbar } = useSnackbar()
  const [selectedProjectId, setSelectedProjectId] = React.useState(null)
  const [isStartingNewTask, setIsStartingNewTask] = React.useState(false)
  const insertTask = useInsertTask()
  const deleteTask = useDeleteTask()
  const userId = rootQuery?.data?.users[0].id
  const taskQuery = useQuery(TASKS_QUERY, {
    variables: {
      userId: userId
    },
    skip: !userId
  })

  const onClickStart = () => setIsStartingNewTask(true)

  const onCreateTask = async () => {
    try {
      await insertTask({
        userId,
        projectId: selectedProjectId
      })
    } catch (err) {
      err.graphQLErrors.forEach(e => {
        enqueueSnackbar(e.message, {
          variant: 'error'
        })
      })
    }
  }

  const onChange = projectId => setSelectedProjectId(projectId)

  const tasks = taskQuery?.data?.tasks || []
  return (
    <AppWrapper
      classes={{}}
      renderToolbar={() => <TopBar />} 
    >
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <Box mb={3}>
              <Typography>Export Data</Typography>
            </Box>
            <Box mb={3}>
              <Button variant='contained' onClick={onClickStart} className={classes.button}>New Data Export Task</Button>
            </Box>

            <Fade in={isStartingNewTask} unmountOnExit mountOnEnter>
              <div>
                <Box mb={3}>
                  <Typography>Select a project</Typography>
                  <ProjectSelect onChange={onChange} />
                </Box>
                <Box mb={3}>
                  <Button variant='contained' onClick={onCreateTask} className={classes.button}>
                    Start Export
                  </Button>
                </Box>
              </div>
            </Fade>

          </Paper>
        </Grid>

        <Grid item xs={6}>
          <div className={classes.tasksContainer}>
            {
              tasks.map(task => {
                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    className={classes.taskCard}
                    onDelete={() => deleteTask({ id: task.id })}
                  />
                )
              })
            }
          </div>
        </Grid>
      </Grid>
    </AppWrapper>
  )
}

export default Migrations

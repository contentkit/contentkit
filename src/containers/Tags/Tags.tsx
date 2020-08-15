import React from 'react' 
import { useQuery, useMutation } from '@apollo/client'
import { ListItemAvatar, Avatar, Button, Toolbar, IconButton, ListItemIcon, ListItemText, ListItem, Paper, List, ListItemSecondaryAction, Typography } from '@material-ui/core'
import { AppWrapper } from '@contentkit/components'
import { Delete } from '@material-ui/icons'
import { ALL_TAGS_AND_POSTS_CONNECTIONS_QUERY, USER_AUTH_QUERY } from '../../graphql/queries'
import { makeStyles } from '@material-ui/styles'
import TopBar from '../../components/TopBar'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useSnackbar } from 'notistack'
import { DELETE_POST_TAG_CONNECTION, DELETE_TAG } from '../../graphql/mutations'

const useStyles = makeStyles(theme => ({
  paper: {
    // @ts-ignore
    margin: theme.spacing(4)
  },
  count: {
    // @ts-ignore
    marginRight: theme.spacing(4)
  }
}))


function Tags (props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const classes = useStyles(props)
  const [deleteConnection] = useMutation(DELETE_POST_TAG_CONNECTION)
  const [deleteTag] = useMutation(DELETE_TAG)
  const userQuery = useQuery(USER_AUTH_QUERY)
  const query = useQuery(ALL_TAGS_AND_POSTS_CONNECTIONS_QUERY, {
    variables: {
      userId: userQuery?.data?.users[0].id
    },
    skip: !userQuery?.data?.users.length
  })
  const tags = query?.data?.tags || []

  const onFinalizeDelete = async (tag) => {
    await Promise.all(
      tag.posts_tags.map(connection => deleteConnection({
        variables: {
          tagId: connection.tag_id,
          postId: connection.post_id
        }
      }))
    )
    await deleteTag({
      variables: {
        tagId: tag.id
      }
    })
  }

  const onDelete = (tag) => () => {
    enqueueSnackbar(`Are you sure that you want to delete tag ${tag.name}?`, {
      variant: 'info',
      persist: true,
      action: key => (
        <Toolbar>
          <Button onClick={() => closeSnackbar(key)}>No</Button>
          <Button onClick={() => onFinalizeDelete(tag)}>Yes</Button>
        </Toolbar>
      )
    })
  }

  const items = React.useMemo(() => {
    return tags.map(tag => ({
      ...tag,
      date: formatDistanceToNow(new Date(tag.updated_at)),
      count: tag.posts_tags.length,
      avatar: `https://logo.clearbit.com/${tag.name}.com`
    }))
  }, [tags])
  return (
    <AppWrapper
      classes={{}}
      disablePadding
      renderToolbar={() => <TopBar />} 
    >
      <Paper className={classes.paper}>
        <List>
        {items.map((tag, key) => (
          <ListItem key={key} button>

            <ListItemAvatar>
              <Avatar src={tag.avatar} />
            </ListItemAvatar>
            <ListItemText primary={tag.name} secondary={tag.date} />
            <Typography className={classes.count}>
              {tag.count} posts
            </Typography>
            <ListItemSecondaryAction>
              <IconButton onClick={onDelete(tag)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
        </List>
      </Paper>
    </AppWrapper>
  )
}

export default Tags

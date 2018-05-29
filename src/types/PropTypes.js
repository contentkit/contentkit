import PropTypes from 'prop-types'

export const Domain = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string
})

export const Project = PropTypes.shape({
  domains: PropTypes.arrayOf(
    Domain
  )
})

export const project = PropTypes.shape({
  data: PropTypes.shape({
    Project: Project
  })
})

export const postMeta = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string,
  slug: PropTypes.string,
  status: PropTypes.string
})

export const document = PropTypes.shape({
  id: PropTypes.string
})

export const Post = PropTypes.shape({
  id: PropTypes.string,
  postMeta,
  document
})

export const allPosts = PropTypes.arrayOf(Post)

export const posts = PropTypes.shape({
  data: PropTypes.shape({
    allPosts
  }),
  variables: PropTypes.shape({}),
  fetchMore: PropTypes.func
})
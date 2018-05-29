// @flow

export type raw = {
  blocks: Array<{key: string, text: string}>,
  blockMap?: any
}

export type document = { 
  id: string,
  versions: {
    id: string,
    raw: raw
  },
  raw: raw
}

export type postMeta = {
  id?: string,
  title: string,
  slug: string,
  excerpt: string
}

export type project = {
  id: string,
  name: string
}

export type post = {
  id: string,
  document: document,
  postMeta: postMeta,
  project: project
}

export type projects = {
  data: {
    allProjects: Array<project>
  },
  variables: { id: string }
}

export type posts = {
  data: {
    allPosts: Array<post>
  },
  variables: { id: string }
}

export type Domain = {
  id?: string,
  name: string
}
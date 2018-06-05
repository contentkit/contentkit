
export type Domain = {
  id?: string,
  name: string
}

export type Project = {
  id: string,
  name: string,
  domain?: Domain
}

export type ProjectQuery = {
  data: {
    Project: Project
  },
  variables: { id: string }
}

export type ProjectsQuery = {
  data: {
    allProjects: Array<Project>
  },
  variables: { id: string }
}

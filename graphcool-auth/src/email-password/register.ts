import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as jwt from 'jsonwebtoken'

interface Project {
  id: string
  secret: string
}

interface EventData {
  id: string
}

export default async (event: FunctionEvent<EventData>) => {

  try {
    const graphcool = fromEvent(event)
    const { id } = event.data
    const api = graphcool.api('simple/v1')
    // const secret = jwt.sign({ id }, 'shhhhh');
    const validityDuration = 365 * 24 * 60 * 60
    const secret = await graphcool.generateNodeToken(id, 'Project', validityDuration)
    await updateProject (api, id, secret)
    return { data: { secret, id }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured.' }
  }
}

async function updateProject(
  api: GraphQLClient, 
  id: string,
  secret: string
): Promise<string>{
  const mutation = `
    mutation ($id: ID!, $secret: String!) {
      updateProject(id: $id, secret: $secret) {
        id
      }
    }
  `
  const variables = {
    id,
    secret
  }
  return api.request<{ updateProject: Project }>(mutation, variables)
    .then(r => r.updateProject.id)
}

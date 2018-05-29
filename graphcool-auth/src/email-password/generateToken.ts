import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'

interface User {
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
    const validityDuration = 365 * 24 * 60 * 60
    const secret = await graphcool.generateNodeToken(id, 'User', validityDuration)
    await updateUser (api, id, secret)
    return { data: { secret, id }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured.' }
  }
}

async function updateUser(
  api: GraphQLClient, 
  id: string,
  secret: string
): Promise<string>{
  const mutation = `
    mutation ($id: ID!, $secret: String!) {
      updateUser(id: $id, secret: $secret) {
        id
      }
    }
  `
  const variables = {
    id,
    secret
  }
  return api.request<{ updateUser: User }>(mutation, variables)
    .then(r => r.updateUser.id)
}

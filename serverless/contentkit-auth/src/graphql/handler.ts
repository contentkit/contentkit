
import { ApolloServer } from 'apollo-server-lambda'
import Pool from 'pg-pool'
import * as pg from 'pg'
import { Context as LambdaContext, APIGatewayProxyEvent } from 'aws-lambda'
import schema from './schema'

export type ApolloContext =  {
  context: LambdaContext,
  event: APIGatewayProxyEvent 
}

export type Context = ApolloContext & {
  client?: pg.Client,
  token?: string
}

let pgClient : pg.Client

async function getClient () {
  if (!pgClient) {
    const pool = new Pool({})
    pgClient = await pool.connect()
  }

  return pgClient
}

const server = new ApolloServer({
  schema,
  introspection: true,
  context: async (ctx: Context) => {
    ctx.context.callbackWaitsForEmptyEventLoop = false
    ctx.client = await getClient()
    const auth = ctx.event.headers.Authorization
    const token = auth && auth.replace(/\s*[Bb]earer\s/, '')
    ctx.token = token
    return ctx
  }
})

export const handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: '*'
  }
})

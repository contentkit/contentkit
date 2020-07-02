import * as jwt from 'jsonwebtoken'
import { ApolloServer, AuthenticationError, gql } from 'apollo-server-lambda'
import * as bcrypt from 'bcryptjs'
import * as Pool from 'pg-pool'
import * as pg from 'pg'
import { Context as LambdaContext, APIGatewayProxyEvent } from 'aws-lambda'
import GraphQLJSON from 'graphql-type-json'
import ConstraintDirective from 'graphql-constraint-directive'
import { EMAIL_REGEX } from './fixtures'
import { createPresignedPost } from './upload'

export type ApolloContext =  {
  context: LambdaContext,
  event: APIGatewayProxyEvent 
}

export type Context = ApolloContext & {
  client?: pg.Client,
  token?: string
}

export type LoginVariables = {
  email: string,
  password: string
}

const { CLIENT_SESSION_SECRET, CLIENT_SESSION_ID } = process.env

function sign (payload, expires): Promise<string> {
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      CLIENT_SESSION_SECRET as string, {
        expiresIn: expires,
        audience: CLIENT_SESSION_ID
      },
      (err, token) => {
        if (err) reject(err)
        else resolve(token)
      }
    )
  )
}

async function getUserByEmail (client, email) {
  if (email.length < 3) {
    throw new AuthenticationError('Invalid email')
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AuthenticationError('Invalid email')
  }

  return client.query(`SELECT * FROM users WHERE email = $1::text`, [email])
    .then(({ rows }) => rows && rows.length ? rows[0] : null)
}

async function resetPassword (_, { email, password }, ctx) {
  let decoded
  try {
    decoded = jwt.decode(ctx.token)
  } catch (err) {
    throw new AuthenticationError('Cannot decode token')
  }

  if (decoded.email !== email) {
    throw new AuthenticationError('Token mismatch')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  let data
  try {
    data = await ctx.client.query(`
      UPDATE users SET password = $2::text WHERE email = $1::text RETURNING *
    `, [email, hash])
  } catch (err) {
    throw err
  }

  return {
    success: Boolean(data.rows && data.rows.length)
  }
}

function throwAuthenticationError () {
  throw new AuthenticationError('Invalid password or account does not exist.')
}

async function login (_, { email, password }: LoginVariables, ctx: Context) {
  const user = await getUserByEmail(ctx.client, email)

  if (!user) {
    return throwAuthenticationError()
  }

  const result = await bcrypt.compare(password, user.password)

  if (!result) {
    return throwAuthenticationError()
  }

  const token = await sign({
    sub: user.id,
    email: email,
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': [
        'user'
      ],
      'x-hasura-user-id': user.id
    }
  }, '168h')

  return { token }
}

async function register (_, { email, password }, ctx) {
  let user = await getUserByEmail(ctx.client, email)

  if (user) {
    throw new AuthenticationError('User exists.')
  }
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  try {
    let data = await ctx.client.query(`INSERT INTO users(email, password) SELECT $1, $2 RETURNING *`, [email, hash])
    user = data.rows[0]
  } catch (err) {
    throw err
  }

  const token = await sign({
    sub: user.id,
    email: email,
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': [
        'user'
      ],
      'x-hasura-user-id': user.id
    }
  }, '168h')

  return { token }
}

async function getToken () {
  const token = await sign({
    email: null,
    sub: '000000000',
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'anonymous',
      'x-hasura-allowed-roles': [
        'anonymous'
      ],
      'x-hasura-user-id': '000000000'
    }
  }, '1y')

  return { token }
}

async function getSecret (_, { id }, ctx) {
  let decoded
  try {
    decoded = jwt.decode(ctx.token)
  } catch (err) {
    throw new AuthenticationError('Cannot decode token')
  }
  let user
  try {
    const data = await ctx.client.query(
      `SELECT * FROM users WHERE id = $1::text`, [decoded.sub]
    )
    user = data.rows[0]
  } catch (err) {
    throw err
  }

  if (!user) {
    throw new AuthenticationError('User not found')
  }

  const token = await sign({
    sub: user.id,
    email: user.email,
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': [
        'user'
      ],
      'x-hasura-user-id': user.id
    }
  }, '1y')

  return { token }
}

const resolvers = {
  Mutation: {
    login,
    register,
    getSecret,
    resetPassword,
    createPresignedPost
  },
  Payload: {},
  Query: {
    getToken
  },
  JSON: GraphQLJSON
}

const typeDefs = gql`
  scalar JSON

  type PresignedPayload {
    url: String!
    fields: JSON
  }

  type Payload {
    token: String!
  }

  type ResetPasswordPayload {
    success: Boolean!
  }

  type Mutation {
    register(email: String! @constraint(format: "email", maxLength: 255), password: String! @constraint(minLength: 3)): Payload
    login(email: String! @constraint(format: "email", maxLength: 255), password: String! @constraint(minLength: 3)): Payload
    resetPassword(email: String!, password: String!): ResetPasswordPayload
    getSecret(id: String!): Payload
    createPresignedPost(userId: String!, key: String!): PresignedPayload
  }

  type Query {
    getToken: Payload
  }
`

let pgClient : pg.Client

async function getClient () {
  if (!pgClient) {
    const pool = new Pool({})
    pgClient = await pool.connect()
  }

  return pgClient
}


const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    constraint: ConstraintDirective
  },
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

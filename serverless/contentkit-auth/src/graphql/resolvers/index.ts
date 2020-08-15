import * as jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-lambda'
import * as bcrypt from 'bcryptjs'
import { Context as LambdaContext, APIGatewayProxyEvent } from 'aws-lambda'
import GraphQLJSON from 'graphql-type-json'
import * as pg from 'pg'

import mailgun from './mailgun'
import { EMAIL_REGEX } from '../fixtures'
import { createPresignedPost } from './upload'
import { getHasuraClaims } from '../util'

export type ApolloContext =  {
  context: LambdaContext,
  event: APIGatewayProxyEvent 
}

export type Context = ApolloContext & {
  client: pg.Client,
  token: string
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

async function getUserByEmail (client: pg.Client, email: string) {
  if (email.length < 3) {
    throw new AuthenticationError('Invalid email')
  }

  if (!EMAIL_REGEX.test(email)) {
    throw new AuthenticationError('Invalid email')
  }

  return client.query(`SELECT * FROM users WHERE email = $1::text`, [email])
    .then(({ rows }) => rows && rows.length ? rows[0] : null)
}

async function resetPassword (_, { credentials: { email, password } }, ctx) {
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

async function login (_, { credentials: { email, password } }, ctx: Context) {
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
    ...getHasuraClaims(user.id)
  }, '168h')

  return { token }
}

async function register (_, { credentials: { email, password } }, ctx) {
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
    ...getHasuraClaims(user.id)
  }, '168h')

  return { token }
}

async function getToken () {
  const token = await sign({
    email: null,
    sub: '000000000',
    ...getHasuraClaims('000000000', 'anonymous')
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
    ...getHasuraClaims(user.id)
  }, '1y')

  return { token }
}


async function sendResetPasswordLink (parent, variables, context) {
  const user = await getUserByEmail(context.client, variables.email)
  const nonce = await sign({
    sub: user.id,
    email: variables.email,
    ...getHasuraClaims(user.id)
  }, '1d')

  const link = `https://contentkit.co/login?nonce=${nonce}`

  const data = {
    from: 'Ben <ben@mail.contentkit.co>',
    to: variables.email,
    subject: 'Password Reset',
    text: [
      'Hi',
      'Please follow this password reset link to restore access to your account.',
      '',
      link,
      '',
      'Thanks'
    ].join('\n')
  }

  console.log(data)
   
  try {
    const body = await mailgun.messages().send(data)
    console.log(body)
  } catch (err) {
    console.error(err)
    return { succes: false }
  }
  return {
    succes: true
  }
}

export default {
  Mutation: {
    login,
    register,
    getSecret,
    resetPassword,
    createPresignedPost,
    sendResetPasswordLink
  },
  Payload: {},
  Query: {
    getToken
  },
  JSON: GraphQLJSON
}

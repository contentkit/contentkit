const jwt = require('jsonwebtoken')
const { ApolloServer, AuthenticationError } = require('apollo-server-lambda')
const bcrypt = require('bcryptjs')
const Pool = require('pg-pool')
const fs = require('fs')
const path = require('path')
const GraphQLJSON = require('graphql-type-json')

const { createPresignedPost } = require('./upload')

const { CLIENT_SESSION_SECRET, CLIENT_SESSION_ID } = process.env

const typeDefs = fs.readFileSync(path.join(__dirname, './schema.graphql'), { encoding: 'utf8' })

function sign (payload, expires) {
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      CLIENT_SESSION_SECRET, {
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

async function login (_, { email, password }, ctx) {
  const user = await getUserByEmail(ctx.client, email)
  const result = await bcrypt.compare(password, user.password)

  if (!result) {
    throw new AuthenticationError('Incorrect password.')
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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (ctx) => {
    ctx.context.callbackWaitsForEmptyEventLoop = false
    const pool = new Pool({})
    ctx.client = await pool.connect()
    const auth = ctx.event.headers.Authorization
    const token = auth && auth.replace(/\s*[Bb]earer\s/, '')
    ctx.token = token
    return ctx
  }
})

module.exports.handler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: '*'
  }
})

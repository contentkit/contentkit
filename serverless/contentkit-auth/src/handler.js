const jwt = require('jsonwebtoken')
const { ApolloServer, AuthenticationError } = require('apollo-server-lambda')
const bcrypt = require('bcryptjs')
const Pool = require('pg-pool')
const fs = require('fs')
const path = require('path')

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

async function login (_, { email, password }, ctx) {
  const user = await getUserByEmail(ctx.client, email)
  const result = await bcrypt.compare(password, user.password)

  if (!result) {
    throw new AuthenticationError('Incorrect password.')
  }

  const token = await sign({
    sub: user.id,
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
  const user = await ctx.client.query(
    `SELECT * FROM users WHERE id = ''`
  )
  const token = await sign({
    sub: user.id,
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': 'user',
      'x-hasura-allowed-roles': [
        'user'
      ],
      'x-hasura-user-id': user.id
    }
  }, '168h')

}

const resolvers = {
  Mutation: {
    login,
    register
  },
  Payload: {},
  Query: {
    getToken
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (ctx) => {
    ctx.context.callbackWaitsForEmptyEventLoop = false
    const pool = new Pool({})
    ctx.client = await pool.connect()

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

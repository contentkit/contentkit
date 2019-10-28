const jwt = require('jsonwebtoken')
const {
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET
} = process.env

const generatePolicy = (token, principalId, effect, resource) => {
  const authResponse = {}
  authResponse.context = {}
  authResponse.context.token = token
  authResponse.principalId = principalId
  if (effect && resource) {
    const policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    const statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  return authResponse
}

module.exports.handler = async (event, context, cb) => {
  if (event.authorizationToken) {
    const token = event.authorizationToken.substring(7)
    const options = {}
    jwt.verify(token, CLIENT_SESSION_SECRET, options, (err, decoded) => {
      if (err) {
        cb(err)
      } else {
        cb(null, generatePolicy(token, decoded.sub, 'Allow', event.methodArn))
      }
    })
  } else {
    cb(new Error('Unauthorized'), null)
  }
}

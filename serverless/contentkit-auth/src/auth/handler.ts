import * as jwt from 'jsonwebtoken'
import * as AWSLambda from 'aws-lambda'
const {
  CLIENT_SESSION_ID,
  CLIENT_SESSION_SECRET
} = process.env

export type DecodedToken = { sub?: string } | undefined

export const ANONYMOUS_SUB = '000000000'

const generatePolicy = (token: string | null, principalId: string, effect: string, resource: string): AWSLambda.APIGatewayAuthorizerResult => {
  const context : AWSLambda.APIGatewayAuthorizerResultContext = { token }
  const policyDocument : AWSLambda.PolicyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource
      }
    ]
  }

  const result : AWSLambda.APIGatewayAuthorizerResult = {
    context,
    principalId,
    policyDocument
  }

  return result
}

async function verify (token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const key : string = CLIENT_SESSION_SECRET
    jwt.verify(token, key, (err: jwt.VerifyErrors, decodedToken: DecodedToken) => {
      if (err || !decodedToken) {
        console.error(err)
        return reject(err)
      }

      resolve(decodedToken.sub as string)
    })
  })
}

export const handler = async (event: AWSLambda.CustomAuthorizerEvent, context: AWSLambda.Context, cb: AWSLambda.CustomAuthorizerCallback): Promise<AWSLambda.CustomAuthorizerResult> => {
  console.log(JSON.stringify(event))
  if (event.authorizationToken) {
    const token = event.authorizationToken.substring(7)
    const sub : string = await verify(event.authorizationToken.substring(7))
    cb(null, generatePolicy(token, sub, 'Allow', event.methodArn))
  } else {
    cb(new Error('Unauthorized'), generatePolicy(null, ANONYMOUS_SUB, 'Deny',  event.methodArn))
  }
}

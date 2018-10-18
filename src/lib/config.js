export const APP_PATH = '/'
export const PROFILE_PATH = '/profile'
export const PROJECTS_PATH = '/projects'
export const LOGIN_PATH = '/login'
export const GRAPHQL_ENDPOINT = process.env.NODE_ENV !== 'production'
  ? 'http://localhost:5000/graphql'
  : '/graphql'
// export const GRAPHQL_ENDPOINT = 'http://localhost:5000/graphql'
export const AWS_BUCKET_URL = 'https://s3.amazonaws.com/contentkit-dev-deploymentbucket-3hlcbqx9f9nl'
export const AWS_REGION = 'us-east-1'
export const AWS_BUCKET_NAME = 'contentkit-dev-deploymentbucket-3hlcbqx9f9nl'
export const IDENTITY_POOL_ID = 'us-east-1:3c213516-e016-45c8-a3a9-92b4e133a8f4'

export default {
  APP_PATH,
  PROFILE_PATH,
  GRAPHQL_ENDPOINT,
  AWS_REGION,
  AWS_BUCKET_NAME,
  AWS_BUCKET_URL,
  IDENTITY_POOL_ID
}

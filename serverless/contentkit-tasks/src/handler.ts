import { Context as LambdaContext, APIGatewayProxyEvent } from 'aws-lambda'
import Pool from 'pg-pool'
import * as pg from 'pg'
import { HasuraTask } from './types'
import AWS, { S3 } from 'aws-sdk'
import { TaskStatus } from './fixtures'

const prefix = 'tasks'

const s3 = new AWS.S3({ region: 'us-east-1' })

let pgClient : pg.Client

async function getClient () {
  if (!pgClient) {
    const pool = new Pool({})
    pgClient = await pool.connect()
  }

  return pgClient
}

function getKey(
  taskId: string,
  recordType: string,
  offset: number
): string {
  return [prefix, taskId, `${recordType}_${offset}.json`].join('/')
} 

function writeExportPartition (key, body) {
  const params : S3.Types.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET as string,
    Key: key,
    Body: body,
    ACL: 'public-read'
  }
  return s3.putObject(params).promise()
}

async function processTask (eventData: HasuraTask) {
  const {  id, user_id, project_id, id: taskId, metadata } = eventData.event.data.new
  const client = await getClient()

  let status
  let storageKey = getKey(taskId, 'posts', 0)
  const offset = metadata.offset || 0

  try {
    const { rows } = await client.query(
      `SELECT * FROM posts WHERE user_id = $1::text AND project_id = $2::text LIMIT 10 OFFSET ${offset}`,
      [
        user_id,
        project_id
      ]
    )
    const segment = JSON.stringify(rows)
    await writeExportPartition(storageKey, segment)
    status = TaskStatus.DONE
  } catch (err) {
    console.error(err)
    status = TaskStatus.ERROR
  } finally {
    const newMetadata = {
      offset: offset + 10
    }
    console.log(newMetadata)
    await client.query(
      `UPDATE tasks SET storage_key = $1::text, status = $2::public.task_status, metadata = $3::jsonb WHERE id = $4::text`, [storageKey, status, newMetadata, taskId]
    )
  }
}

export async function handler (event: APIGatewayProxyEvent, context: LambdaContext, callback) {
  context.callbackWaitsForEmptyEventLoop = false
  console.log(event)
  const eventData : HasuraTask = JSON.parse(event.body as string)
  await processTask(eventData)

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({})
  })
}
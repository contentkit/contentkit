import mailgun from 'mailgun-js'

const apiKey = (process.env.MAILGUN_API_KEY as string)
const domain = (process.env.MAILGUN_DOMAIN as string)

export default mailgun({ apiKey, domain })
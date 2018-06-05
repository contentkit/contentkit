import { fromEvent, FunctionEvent } from 'graphcool-lib'
import { GraphQLClient } from 'graphql-request'
import * as dns from 'dns'

const lookup = (ipAddress): Promise<Array<string>> => new Promise((resolve, reject) => {
  dns.reverse(ipAddress, (err, hostnames) => { resolve(hostnames || []) })
})

interface EventData {
  id: string
}

interface Domain {
  id: string,
  name: string
}

interface Project {
  id: string,
  domains: Array<Domain>
}

export default async (event) => {
  try {
    const graphcool = fromEvent(event)
    const { project, ipAddress } = event.data
    const api = graphcool.api('simple/v1')
    const { domains, user } = await getDomain(api, project)
    const hostnames = await lookup(ipAddress)
    console.log({ domains, hostnames })
    let domainNames = domains.map(d => d.name)
    while(domainNames.length) {
      let domainName = domainNames.shift()
      domainName = domainName.replace('*.', '.\*')
      let re = new RegExp(`\^${domainName}\$`, 'm')
      let valid = hostnames.find(hostname => re.test(hostname))
      if (valid) {
        return { data: { valid: true, secret: user.secret } }
      }
    }
    return { data: { valid: false } }
  } catch (e) {
    console.log(e)
    return { error: 'An unexpected error occured.' }
  }
}

async function getDomain(
  api: GraphQLClient, 
  id: string
): Promise<any>{
  const query = `
    query ($id: ID!) {
      Project (id: $id) {
        id
        user {
          secret
        }
        domains {
          name
        }
      }
    }
  `
  return api.request<{ Project: Project }>(query, { id })
    .then(data => data.Project)
}

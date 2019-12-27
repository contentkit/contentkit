import format from 'date-fns/format'
import Haikunator from 'haikunator'

const seenKeys = {}
const MULTIPLIER = Math.pow(2, 24)

export const genKey = () => {
  let key
  while (key === undefined || seenKeys.hasOwnProperty(key) || !isNaN(+key)) {
    key = Math.floor(Math.random() * MULTIPLIER).toString(32)
  }
  seenKeys[key] = true
  return key
}

export const genDate = () => {
  return format(new Date())
}

const haikunator = new Haikunator()

export const genProjectName = () => haikunator.haikunate()
// @flow
import Haikunator from 'haikunator'

export function slugify (text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const haikunator = new Haikunator()

export const genProjectName = () => haikunator.haikunate()

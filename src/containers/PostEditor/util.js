// @flow
import { EditorState, convertFromRaw } from 'draft-js'
import { exportHtml, convertToRaw } from 'monograph'
import escapeHtml from 'lodash.escape'
import { expand, compress } from 'draft-js-compact'
import * as diffPatch from 'jsondiffpatch'
import { Seq } from 'immutable'
import LocalStorage from './LocalStorage'

const storage = new LocalStorage()

export const convertToHtml = editorState =>
  escapeHtml(exportHtml(editorState))

export const isLoaded = ({ post }) => Boolean(post && post.Post)

export const toRaw = editorState => compress(
  convertToRaw(editorState.getCurrentContent())
)

export const fromRaw = raw => EditorState.createWithContent(
  convertFromRaw(expand(raw))
)

export const hydrate = ({ editorState, post: { Post } }) => (
  fromRaw(Post.document.raw || Post.json)
)

export const update = ({
  raw,
  updateDocument,
  editorState,
  document
}) => {
  const html = convertToHtml(editorState)
  const excerpt = document.excerpt || raw.blocks[0].text
  updateDocument.mutate({
    id: document.id,
    raw: raw,
    excerpt: excerpt,
    html: html
  })
}

export const shouldIncrement = ({ versions }) => {
  const edge = getCurrentVersion({ versions })
  const createdAt = new Date(edge.createdAt).getTime()
  const interval = 1000 * 60 * 60 * 24 // 24 hours
  return (Date.now() - interval) > createdAt
}

export const toKey = (...args) => args.join('/')

export const fromKey = cacheKey => cacheKey.split('/')

export const getCurrentVersion = ({ versions }) => (
  versions[versions.length - 1]
)

export const setDiff = ({ diff, document }) => {
  if (!(document.versions && document.versions.length)) return /* eslint-disable-line */
  const documentId = document.id
  const versionId = getCurrentVersion(document).id
  const versionsKey = toKey(documentId, 'versions')
  const number = (storage.get(versionsKey) || []).length + 1
  const diffKey = toKey(versionId, number, 'diff')

  storage.push(
    versionsKey,
    { key: diffKey, timestamp: Date.now() / 1000 }
  )
  storage.set(diffKey, diff)
}

export const getRawDiff = (editorState, document) => {
  const raw = toRaw(editorState)
  const diff = diffPatch.diff({ ...document.raw }, raw)
  return { diff, raw }
}

window.getRawDiff = getRawDiff

export const getVersions = (id: string) => {
  const key = toKey(id, 'versions')
  const versions = new LocalStorage().get(key)
  return versions
}

export const getDiffs = (document, diffKey) => {
  let id = document.id
  let allVersions = getVersions(id)
  const [versionId, versionNumber] = fromKey(diffKey)
  let versions = Seq(allVersions)
    .skipWhile(({ key }) => fromKey(key)[0] !== versionId)
    .takeWhile(({ key }) => fromKey(key)[1] <= Number(versionNumber))
    .toArray()
  const data = []
  while (versions.length) {
    let { key } = versions.shift()
    let delta = storage.get(key)
    if (delta !== null) {
      data.push(delta)
      continue
    }
  }
  return data
}

export const restoreContentState = (document, diffKey) => {
  const [versionId, versionNumber] = fromKey(diffKey) /* eslint-disable-line */
  const raw = document.versions.find(({ id }) => id === versionId).raw
  let diffs = getDiffs(document, diffKey)
  let patched = diffPatch.clone(raw)
  while (diffs.length) {
    let diff = diffs.shift()
    try {
      patched = diffPatch.patch(patched, diff)
    } catch (err) {
      console.warn(err)
    }
  }
  return convertFromRaw(expand(patched))
}

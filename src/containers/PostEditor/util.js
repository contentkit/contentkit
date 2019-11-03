import { EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import { exportHtml } from '@contentkit/editor'
import { expand, compress } from 'draft-js-compact'
import { encode } from '../../lib/utf8'
import { Block } from '@contentkit/util'
import transform from '@contentkit/util/lib/utils/transform'

export const convertToHtml = editorState => {
  const html = exportHtml(editorState)

  return encode(html)
}

export const isLoaded = ({ post }) => Boolean(post && post.Post)

export const toRaw = editorState => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

export const fromRaw = raw => {
  return EditorState.createWithContent(
    convertFromRaw(expand(raw))
  )
}

export const hydrate = (editorState, compressedRaw) => {
  const raw = expand(compressedRaw)
  const blocks = raw.blocks.reduce((a, block) => {
    if (block.type !== Block.CODE) {
      a.push(block)
      return a
    }

    const codeBlocks = block.text.split(/\r?\n/g)
      .map(text => {
        return {
          ...block,
          text: text,
          key: genKey()
        }
      })
    a = a.concat(codeBlocks)
    return a
  }, [])

  return EditorState.createWithContent(convertFromRaw({
    ...raw,
    blocks
  }))
}

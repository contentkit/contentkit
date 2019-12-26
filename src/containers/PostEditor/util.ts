import { EditorState, convertFromRaw, convertToRaw, genKey } from 'draft-js'
import { convertToHTML } from '@contentkit/convert'
import { expand, compress } from 'draft-js-compact'
import { Block } from '@contentkit/util'
import transform from '@contentkit/util/lib/utils/transform'

import { encode } from '../../lib/utf8'

export const toRaw = (editorState: EditorState) => {
  return compress(convertToRaw(editorState.getCurrentContent()))
}

export const fromRaw = (raw: any): EditorState => {
  return EditorState.createWithContent(
    convertFromRaw(expand(raw))
  )
}

export const hydrate = (editorState: EditorState, compressedRaw: any): EditorState => {
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

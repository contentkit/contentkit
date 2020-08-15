import { createSelector } from 'reselect'
import EditorCache from './EditorCache'


export const getCurrentPostId = state => {
  const parts = state.router.location.pathname.split('/').filter(Boolean)
  return parts[parts.length - 1]
}


export const getLocalEditorState = createSelector(
  [getCurrentPostId],
  (id) => {
    return EditorCache.create(id).getEditorState()
  }
)

export const getRawEditorState = createSelector(
  [getCurrentPostId],
  (id) => EditorCache.create(id).getRawState()
)
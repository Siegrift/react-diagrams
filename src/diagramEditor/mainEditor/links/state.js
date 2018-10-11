// @flow
import type { StateDraft } from '../../../flow/reduxTypes'
import type { AppliedLinkState } from './flow'

import type { EditorKey, Path } from '../../../flow/commonTypes'

export const PATH_LINKS = ['links']
export const PATH_CURRENT_LINK = ['currentLink']
export const PATH_CURRENT_LINK_POINTS = [...PATH_CURRENT_LINK, 'path']
export const getLinkPathByEditorKey = (editorKey: EditorKey): Path => [...PATH_LINKS, editorKey]
export const getLinkPointsPathByLinkKey = (linkKey: EditorKey): Path => [
  ...PATH_LINKS,
  linkKey,
  'path',
]

export const setInitialState = (state: StateDraft): StateDraft & AppliedLinkState => ({
  ...state,
  [PATH_LINKS.toString()]: {},
  [PATH_CURRENT_LINK.toString()]: undefined,
})

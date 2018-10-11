// @flow
import type { StateDraft } from '../../../flow/reduxTypes'
import type { AppliedLinkPointsState } from './flow'

import type { EditorKey, Path } from '../../../flow/commonTypes'

export const PATH_LINK_POINTS = ['linkPoints']
export const linkPointPathByEditorKey = (editorKey: EditorKey): Path => [
  ...PATH_LINK_POINTS,
  editorKey,
]

export const setInitialState = (state: StateDraft): StateDraft & AppliedLinkPointsState => ({
  ...state,
  [PATH_LINK_POINTS.toString()]: {},
})

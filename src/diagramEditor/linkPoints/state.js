// @flow
import type { StateDraft } from '../../initialState'

import type { EditorKey, Path } from '../../commonTypes'

export const PATH_LINK_POINTS = ['linkPoints']
export const linkPointPathByEditorKey = (editorKey: EditorKey): Path => [
  ...PATH_LINK_POINTS,
  editorKey,
]

export type LinkPoint = Position & {
  editorKey: EditorKey,
  linkKey: EditorKey,
  selected: boolean,
  visible: boolean,
}

export type LinkPointsState = { [key: EditorKey]: LinkPoint }

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedLinkPointsState = { linkPoints: LinkPointsState }

export const setInitialState = (state: StateDraft): StateDraft & AppliedLinkPointsState => ({
  ...state,
  [PATH_LINK_POINTS.toString()]: {},
})

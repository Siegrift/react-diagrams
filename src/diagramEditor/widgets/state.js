// @flow
import type { StateDraft } from '../../initialState'
import type { EditorKey, Path, Position, Node } from '../../flow/commonTypes'

export const PATH_WIDGETS = ['widgets']
export const getWidgetPathByEditorKey = (editorKey: EditorKey): Path => [...PATH_WIDGETS, editorKey]

export type Widget = {
  key: string,
  inPortKeys: EditorKey[],
  outPortKeys: EditorKey[],
} & Position &
  Node
export type WidgetState = { [key: EditorKey]: Widget }
export type AppliedWidgetState = { widgets: WidgetState }

// NOTE: Type needs to be manually updated when PATH changes
export const setInitialState = (state: StateDraft): StateDraft & AppliedWidgetState => ({
  ...state,
  [PATH_WIDGETS.toString()]: {},
})

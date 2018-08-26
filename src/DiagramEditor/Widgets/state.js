// @flow
import type { StateDraft } from '../../initialState'
import type { EditorKey, Path } from '../../commonTypes'

export const PATH_WIDGETS = ['widgets']
export const getWidgetPathByEditorKey = (editorKey: EditorKey): Path => [...PATH_WIDGETS, editorKey]

// FLOW: TBD
export type Widget = {}
export type WidgetsState = { [key: EditorKey]: Widget }
export type AppliedWidgetState = { widgets: WidgetsState }

// NOTE: Type needs to be manually updated when PATH changes
export const setInitialState = (state: StateDraft): StateDraft & WidgetsState => ({
  ...state,
  [PATH_WIDGETS.toString()]: {},
})

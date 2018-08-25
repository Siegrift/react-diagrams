// @flow
import type { StateDraft } from '../../initialState'

export const PATH_WIDGETS = ['widgets']
export const getWidgetPathByEditorKey = (editorKey) => [...PATH_WIDGETS, editorKey]

// FLOW: TBD
export type WidgetsState = {}
export type AppliedWidgetState = { widgets: WidgetsState }

// NOTE: Type needs to be manually updated when PATH changes
export const setInitialState = (state: StateDraft): StateDraft & WidgetsState => ({
  ...state,
  [PATH_WIDGETS]: {},
})

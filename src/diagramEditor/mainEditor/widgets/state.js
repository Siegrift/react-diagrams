// @flow
import type { StateDraft } from '../../../flow/reduxTypes'
import type { EditorKey, Path } from '../../../flow/commonTypes'
import type { AppliedWidgetState } from './flow'

export const PATH_WIDGETS = ['widgets']
export const getWidgetPathByEditorKey = (editorKey: EditorKey): Path => [...PATH_WIDGETS, editorKey]

// NOTE: Type needs to be manually updated when PATH changes
export const setInitialState = (state: StateDraft): StateDraft & AppliedWidgetState => ({
  ...state,
  [PATH_WIDGETS.toString()]: {},
})

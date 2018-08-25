import { get } from 'lodash'
import { PATH_WIDGETS, getWidgetPathByEditorKey } from './state'

export const widgetsSelector = (state) => get(state, PATH_WIDGETS)
export const getWidgetByEditorKey = (state, editorKey) =>
  get(state, getWidgetPathByEditorKey(editorKey))

// @flow
import { get, filter, flatten, map } from 'lodash'
import { PATH_WIDGETS, getWidgetPathByEditorKey } from './state'
import { createSelector } from 'reselect'

import type { Widget, WidgetState } from './flow'
import type { EditorKey } from '../../../flow/commonTypes'
import type { State } from '../../../flow/reduxTypes'

export const widgetsSelector = (state: State) => get(state, PATH_WIDGETS)
export const getWidgetByEditorKey = (state: State, editorKey: EditorKey) =>
  get(state, getWidgetPathByEditorKey(editorKey))

export const selectedWidgetsSelector = createSelector(widgetsSelector, (widgets: WidgetState) =>
  filter(widgets, (widget: Widget) => widget.selected)
)

// ports cannot be selected but are deleted together with widgets and can trigger move on links
export const selectedPortsSelector = createSelector(
  selectedWidgetsSelector,
  (widgets: WidgetState) =>
    flatten(map(widgets, (widget: Widget) => [...widget.outPortKeys, ...widget.inPortKeys]))
)

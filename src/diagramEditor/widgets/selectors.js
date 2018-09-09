// @flow
import { get, filter, flatten, map } from 'lodash'
import { PATH_WIDGETS, getWidgetPathByEditorKey } from './state'
import { createSelector } from 'reselect'

import type { EditorKey } from '../../flow/commonTypes'
import type { State } from '../../flow/reduxTypes'
import type { Widget, WidgetState } from './state'

export const widgetsSelector = (state: State) => get(state, PATH_WIDGETS)
// TODO: make a selector
export const getWidgetByEditorKey = (state: State, editorKey: EditorKey) =>
  get(state, getWidgetPathByEditorKey(editorKey))

export const widgetsToMoveSelector = createSelector(widgetsSelector, (widgets: WidgetState) =>
  filter(widgets, (widget: Widget) => widget.selected)
)

export const portsToMoveSelector = createSelector(widgetsToMoveSelector, (widgets: WidgetState) =>
  flatten(map(widgets, (widget: Widget) => [...widget.outPortKeys, ...widget.inPortKeys]))
)

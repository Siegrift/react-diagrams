// @flow
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { PATH_WIDGETS } from './state'
import { setIn } from 'immutable'
import { getWidgetByEditorKey } from './selectors'

import type { Dispatch, State } from '../../reduxTypes'
import type { EditorKey, Position, Dimension } from '../../commonTypes'
import type { Widget } from './state'

export type DagreWidget = {
  key: EditorKey,
  // position is the center of the node
  widget: Position & Dimension,
}

export const onWidgetMouseDown = (editorKey: EditorKey, e: MouseEvent) => (dispatch: Dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

export const setFormattedWidgets = (dagreWidgets: DagreWidget[]) => ({
  type: 'Set Formatted widgets',
  undoable: false,
  reducer: (state: State) => {
    const widgets = dagreWidgets.map(
      ({ key, widget }: DagreWidget): Widget[] => ({
        ...getWidgetByEditorKey(state, key),
        x: widget.x,
        y: widget.y,
      })
    )
    return setIn(state, PATH_WIDGETS, widgets)
  },
})

// @flow
import { mergeIn } from '../../imuty'
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { selectedWidgetsSelector } from './selectors'
import { PATH_WIDGETS } from './state'

import type { State, Dispatch } from '../../flow/reduxTypes'
import type { EditorKey, Position } from '../../flow/commonTypes'
import type { Widget, WidgetState } from './state'

export const onWidgetMouseDown = (editorKey: EditorKey, e: MouseEvent) => (dispatch: Dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

export const moveSelectedWidgets = (diff: Position) => ({
  type: 'Move selected widgets',
  payload: diff,
  loggable: false,
  undoable: false,
  reducer: (state: State) => {
    const toMove = selectedWidgetsSelector(state)
    return mergeIn(
      state,
      PATH_WIDGETS,
      toMove.reduce(
        (acc: WidgetState, widget: Widget) => ({
          ...acc,
          [widget.editorKey]: {
            ...widget,
            x: widget.x + diff.x,
            y: widget.y + diff.y,
          },
        }),
        {}
      )
    )
  },
})

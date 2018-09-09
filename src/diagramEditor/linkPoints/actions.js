// @flow
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { linkPointsToMoveSelector } from './selectors'
import { mergeIn } from '../../imuty'
import { PATH_LINK_POINTS } from './state'

import type { EditorKey, Position } from '../../flow/commonTypes'
import type { Thunk, Dispatch, GenericAction, State } from '../../flow/reduxTypes'
import type { LinkPoint } from './state'

export const onPointMouseDown = (event: MouseEvent, editorKey: EditorKey): Thunk => (
  dispatch: Dispatch
) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, event.ctrlKey))
}

export const moveSelectedLinkPoints = (diff: Position): GenericAction<Position> => ({
  type: 'Move selected link points',
  payload: diff,
  loggable: false,
  undoable: false,
  reducer: (state: State) => {
    const toMove = linkPointsToMoveSelector(state)
    return mergeIn(
      state,
      PATH_LINK_POINTS,
      toMove.reduce(
        (acc: Object, linkPoint: LinkPoint) => ({
          ...acc,
          [linkPoint.editorKey]: {
            ...linkPoint,
            x: linkPoint.x + diff.x,
            y: linkPoint.y + diff.y,
          },
        }),
        {}
      )
    )
  },
})

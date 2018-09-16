// @flow
import { setIn, multiSetIn, mergeIn } from '../../imuty'
import { PATH_CURRENT_LINK_POINTS, PATH_LINKS, getLinkPointsPathByLinkKey } from './state'
import { currentLinkPointsSelector } from './selectors'
import { relativeMousePoint } from '../mainEditor/selectors'
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { uniqueId, map, flatten } from 'lodash'
import { distance } from './linkUtils'
import { createDefaultLinkPoint } from '../linkPoints/linkPointUtils'
import { PATH_LINK_POINTS } from '../linkPoints/state'
import { getLinkByEditorKey, linksToMoveSelector } from './selectors'
import { linkPointsByEditorKeys, linkPointsSelector } from '../linkPoints/selectors'

import type { CurrentLink, Link } from './state'
import type { LinkPoint } from '../linkPoints/state'
import type { EditorKey, Position } from '../../flow/commonTypes'
import type { State, Dispatch, GetState } from '../../flow/reduxTypes'

const addPointToLink = (linkKey: EditorKey, event: MouseEvent) => ({
  type: 'Add point to link',
  payload: { linkKey, event },
  undoable: true,
  reducer: (state: State) => {
    const rawPoint = { x: event.clientX, y: event.clientY }
    const linkPointKeys = [...getLinkByEditorKey(state, linkKey).path]
    const path = linkPointsByEditorKeys(linkPointKeys)(state)
    const point = relativeMousePoint(state, rawPoint)
    const { pos } = path.reduce(
      (acc: Object, value: LinkPoint, index: number) => {
        if (index === 0) return acc
        if (distance(path[index - 1], value, point) < acc.diff) {
          return {
            diff: distance(path[index - 1], value, point),
            pos: index,
          }
        }
        return acc
      },
      { diff: Number.MAX_VALUE, pos: 0 }
    )
    const linkPoint = createDefaultLinkPoint(point)
    linkPointKeys.splice(pos, 0, linkPoint.editorKey)
    return multiSetIn(
      state,
      [
        PATH_LINK_POINTS,
        {
          ...linkPointsSelector(state),
          [linkPoint.editorKey]: linkPoint,
        },
      ],
      [getLinkPointsPathByLinkKey(linkKey), linkPointKeys]
    )
  },
})

export const onLinkMouseDown = (event: MouseEvent, editorKey: EditorKey) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  dispatch(setDragging(true))
  if (event.ctrlKey) dispatch(setSelectedNode(editorKey, true))
  else dispatch(addPointToLink(editorKey, event))
}

export const addPointToCurrentLink = (point: Position, isUndoable?: boolean) => ({
  type: 'Add point to current link',
  payload: {point, isUndoable},
  undoable: isUndoable !== undefined ? isUndoable : true,
  reducer: (state: State) => {
    const linkPoint = createDefaultLinkPoint(relativeMousePoint(state, point))
    return multiSetIn(
      state,
      [[...PATH_LINK_POINTS, linkPoint.editorKey], linkPoint],
      [PATH_CURRENT_LINK_POINTS, [...currentLinkPointsSelector(state), linkPoint.editorKey]]
    )
  },
})

export const addLink = (link: CurrentLink & { target: EditorKey }) => ({
  type: 'Add link',
  payload: link,
  undoable: false,
  reducer: (state: State) => {
    const editorKey = uniqueId()
    return setIn(state, [...PATH_LINKS, editorKey], { ...link, selected: false, editorKey })
  },
})

export const moveSelectedLinks = (diff: Position) => ({
  type: 'Move selected links',
  payload: diff,
  loggable: false,
  undoable: false,
  reducer: (state: State) => {
    const linkstoMove = linksToMoveSelector(state)
    const pointsToMove = flatten(map(linkstoMove, (link: Link) => link.path.slice(1, -1)))
    const linkPoints = linkPointsSelector(state)
    return mergeIn(
      state,
      PATH_LINK_POINTS,
      pointsToMove.reduce(
        (acc: Object, pointKey: EditorKey) => ({
          ...acc,
          [linkPoints[pointKey].editorKey]: {
            ...linkPoints[pointKey],
            x: linkPoints[pointKey].x + diff.x,
            y: linkPoints[pointKey].y + diff.y,
          },
        }),
        {}
      )
    )
  },
})

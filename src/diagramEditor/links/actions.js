import { setIn, multiSetIn, mergeIn } from '../../imuty'
import { PATH_CURRENT_LINK_POINTS, PATH_LINKS, getLinkPointsPathByLinkKey } from './state'
import { currentLinkPointsSelector } from './selectors'
import { relativeMousePoint } from '../mainEditor/selectors'
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { uniqueId, map, flatten } from 'lodash'
import { getWidgetByEditorKey } from '../widgets/selectors'
import { portByEditorKeySelector } from '../ports/selectors'
import { distance } from './linkUtils'
import { createDefaultLinkPoint } from '../linkPoints/linkPointUtils'
import { PATH_LINK_POINTS } from '../linkPoints/state'
import { getLinkByEditorKey, linksToMoveSelector } from './selectors'
import { linkPointsByEditorKeys, linkPointsSelector } from '../linkPoints/selectors'

const addPointToLink = (link, event) => ({
  type: 'Add point to link',
  payload: { link, event },
  undoable: true,
  reducer: (state) => {
    const rawPoint = { x: event.clientX, y: event.clientY }
    const linkPointKeys = [...getLinkByEditorKey(state, link).path]
    const path = linkPointsByEditorKeys(linkPointKeys)(state)
    const point = relativeMousePoint(state, rawPoint)
    const { pos } = path.reduce(
      (acc, value, index) => {
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
      [getLinkPointsPathByLinkKey(link), linkPointKeys]
    )
  },
})

export const onLinkMouseDown = (event, editorKey) => (dispatch, getState) => {
  dispatch(setDragging(true))
  if (event.ctrlKey) dispatch(setSelectedNode(editorKey, true))
  else dispatch(addPointToLink(editorKey, event))
}

export const addPointToCurrentLink = (point, isUndoable) => ({
  type: 'Add point to current link',
  payload: point,
  undoable: isUndoable !== undefined ? isUndoable : true,
  reducer: (state) => {
    const linkPoint = createDefaultLinkPoint(relativeMousePoint(state, point))
    return multiSetIn(
      state,
      [[...PATH_LINK_POINTS, linkPoint.editorKey], linkPoint],
      [PATH_CURRENT_LINK_POINTS, [...currentLinkPointsSelector(state), linkPoint.editorKey]]
    )
  },
})

export const addLink = (link) => ({
  type: 'Add link',
  payload: link,
  undoable: false,
  reducer: (state) => {
    const editorKey = uniqueId()
    return setIn(state, [...PATH_LINKS, editorKey], { ...link, selected: false, editorKey })
  },
})

// TODO: move to link utils
export const isInvalidLink = (state, sourceEditorKey, destinationEditorKey, linkChecker) => {
  const sourcePort = portByEditorKeySelector(state, sourceEditorKey)
  const sourceWidget = getWidgetByEditorKey(state, sourcePort.widgetEditorKey)
  const destinationPort = portByEditorKeySelector(state, destinationEditorKey)
  const destinationWidget = getWidgetByEditorKey(state, destinationPort.widgetEditorKey)
  return !linkChecker(sourcePort, sourceWidget, destinationPort, destinationWidget)
}

export const moveSelectedLinks = (diff) => ({
  type: 'Move selected links',
  payload: diff,
  loggable: false,
  undoable: false,
  reducer: (state) => {
    const linkstoMove = linksToMoveSelector(state)
    const pointsToMove = flatten(map(linkstoMove, (link) => link.path.slice(1, -1)))
    const linkPoints = linkPointsSelector(state)
    return mergeIn(
      state,
      PATH_LINK_POINTS,
      pointsToMove.reduce(
        (acc, pointKey) => ({
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

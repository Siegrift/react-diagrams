import update from 'immutability-helper'
import { setIn } from 'immutable'
import { PATH_CURRENT_LINK_POINTS, PATH_LINKS } from './state'
import { currentLinkPointsSelector, linksSelector } from './selectors'
import { relativeMousePoint } from '../mainEditor/selectors'
import { setDragging, setSelectedNode } from '../mainEditor/actions'
import { uniqueId } from 'lodash'
import { getWidgetByEditorKey } from '../widgets/selectors'
import { portByEditorKeySelector } from '../ports/selectors'
import { distance, createDefaultLinkPoint } from './linkUtils'

const addPointToLink = (link, event) => ({
  type: 'Add point to link',
  payload: { link, event },
  undoable: true,
  reducer: (state) => {
    const links = linksSelector(state),
      rawPoint = { x: event.clientX, y: event.clientY }
    const path = links[link].path.slice(0),
      point = relativeMousePoint(state, rawPoint)
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
    path.splice(pos, 0, createDefaultLinkPoint(point))
    return update(state, {
      editor: {
        links: {
          [link]: {
            path: {
              $set: path,
            },
          },
        },
      },
    })
  },
})

export const onLinkMouseDown = (event, editorKey) => (dispatch, getState) => {
  dispatch(setDragging(true))
  if (event.ctrlKey) dispatch(setSelectedNode(editorKey, true))
  else dispatch(addPointToLink(editorKey, event))
}

export const onPointMouseDown = (event, editorKey) => (dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, event.ctrlKey))
}

export const addPointToCurrentLink = (point, isUndoable) => ({
  type: 'Add point to current link',
  payload: point,
  undoable: isUndoable ? isUndoable() : true,
  reducer: (state) =>
    setIn(state, PATH_CURRENT_LINK_POINTS, [
      ...currentLinkPointsSelector(state),
      createDefaultLinkPoint(relativeMousePoint(state, point)),
    ]),
})

// TODO: rename to "addLink"
export const addToLinks = (link) => ({
  type: 'Add to links',
  payload: link,
  undoable: true,
  reducer: (state) => {
    const editorKey = uniqueId()
    return setIn(state, [...PATH_LINKS, editorKey], { ...link, selected: false, editorKey })
  },
})

export const isInvalidLink = (state, sourceEditorKey, destinationEditorKey, linkChecker) => {
  console.log(sourceEditorKey, destinationEditorKey, 'aaaa')
  const sourcePort = portByEditorKeySelector(state, sourceEditorKey)
  const sourceWidget = getWidgetByEditorKey(state, sourcePort.widgetEditorKey)
  const destinationPort = portByEditorKeySelector(state, destinationEditorKey)
  const destinationWidget = getWidgetByEditorKey(state, destinationPort.widgetEditorKey)
  return !linkChecker(sourcePort, sourceWidget, destinationPort, destinationWidget)
}

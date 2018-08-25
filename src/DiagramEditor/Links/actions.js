import update from 'immutability-helper'
import { setIn } from 'immutable'
import { PATH_CURRENT_LINK_POINTS, PATH_LINKS } from './state'
import { currentLinkPointsSelector, linksSelector } from './selectors'
import { relativeMousePoint } from '../MainEditor/selectors'
import { setDragging, setSelectedNode } from '../MainEditor/actions'
import { concat, flatten, map, uniqueId } from 'lodash'
import { widgetsSelector } from '../Widgets/selectors'

// TODO: move to utils
const distance = (p1, p2, p3) => {
  return (
    Math.abs(p1.x - p3.x) + Math.abs(p1.y - p3.y) + Math.abs(p2.x - p3.x) + Math.abs(p2.y - p3.y)
  )
}

export const createDefaultLinkPoint = (position) => ({
  ...position,
  editorKey: uniqueId(),
  selected: false,
})

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

// TODO: this should be a selector
const getLinkDataByEditorKey = (state, editorKey) => {
  const ports = flatten(
    map(widgetsSelector(state), (widget) => {
      return concat(
        map(widget.inPorts, (port) => ({ ...port, isInPort: true })),
        map(widget.outPorts, (port) => ({ ...port, isInPort: false }))
      )
    })
  )
  return ports.find((port) => port.editorKey === editorKey)
}

export const isInvalidLink = (state, sourceEditorKey, destinationEditorKey, linkChecker) => {
  const source = getLinkDataByEditorKey(state, sourceEditorKey)
  const destination = getLinkDataByEditorKey(state, destinationEditorKey)
  return !linkChecker(source, destination)
}

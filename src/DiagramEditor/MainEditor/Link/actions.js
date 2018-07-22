import update from 'immutability-helper'
import { setIn } from 'immutable'
import { PATH_CURRENT_LINK_POINTS, currentLinkPointsSelector, linksSelector } from '../state'
import {
  createDefaultLinkPoint,
  relativeMousePoint,
  setDragging,
  setSelectedNode,
} from '../actions'

const distance = (p1, p2, p3) => {
  return (
    Math.abs(p1.x - p3.x) + Math.abs(p1.y - p3.y) + Math.abs(p2.x - p3.x) + Math.abs(p2.y - p3.y)
  )
}

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

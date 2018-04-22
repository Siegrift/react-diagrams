import { PATH_EDITOR, PATH_MOUSE, PATH_CANVAS, PATH_CURRENT_LINK, PATH_LINKS, currentLinkSelector, editorRefSelector, linksSelector } from './state'
import { uniqueId, reduce, some, map, filter } from 'lodash'
import update from '../../utils/update'

const setDragging = (editorState, isDragging) => update(editorState, {
  mouse: {
    dragging: { $set: isDragging },
  },
})

const getRelativePoint = (editorRef, { x, y }) => {
  const boundingRect = editorRef.getBoundingClientRect()
  return { x: x - boundingRect.left, y: y - boundingRect.top }
}

const getRelativeMousePoint = (editorState, { x, y }) => {
  const boundingRect = editorState.editorRef.getBoundingClientRect()
  const zoom = editorState.canvas.zoom
  const offset = editorState.canvas.offset
  return {
    x: (x - boundingRect.left - boundingRect.width * (1 - zoom) / 2 - offset.x) / zoom,
    y: (y - boundingRect.top - boundingRect.height * (1 - zoom) / 2 - offset.y) / zoom,
  }
}

export const addWidget = (command, pos) => ({
  type: 'Add widget to editor',
  path: [...PATH_EDITOR],
  payload: { command, pos },
  reducer: (state) => {
    const id = uniqueId()
    const adjustedPos = getRelativeMousePoint(state, pos)
    return {
      ...state,
      widgets: {
        ...state.widgets,
        [id]: {
          ...command,
          inPorts: command.inPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
          outPorts: command.outPorts.map((port) => ({ ...port, editorKey: uniqueId() })),
          ...adjustedPos,
          editorKey: id,
          selected: false,
        },
      },
    }
  },
})


export const setSelectedWidget = (widgetKey, onlyAppend) => ({
  type: 'Add to selected widgets',
  path: [...PATH_EDITOR],
  payload: { widgetKey, onlyAppend },
  reducer: (state) => {
    let widgetsState = state.widgets
    if (!onlyAppend) {
      widgetsState = reduce(
        widgetsState,
        (acc, value, key) => ({ ...acc, [key]: { ...value, selected: false } }),
        {}
      )
    }
    if (widgetKey !== -1) {
      widgetsState = update(widgetsState, {
        [widgetKey]: {
          selected: {
            $apply: (selected) => !selected,
          },
        },
      })
    }
    return { ...setDragging(state, true), widgets: widgetsState }
  },
})

export const setEditorRef = (ref) => ({
  type: 'Set editor ref',
  path: [...PATH_EDITOR, 'editorRef'],
  payload: { ref },
  notLogable: true,
  reducer: (state) => ref,
})

export const onEditorMouseMove = (position) => ({
  type: 'Editor mouse move',
  path: [...PATH_EDITOR],
  payload: { position },
  notLogable: true,
  reducer: (state) => {
    let newState = update(state, {
      mouse: {
        cursor: { $set: getRelativePoint(state.editorRef, position) },
      },
    })
    if (newState.mouse.dragging) {
      const diffX = newState.mouse.cursor.x - state.mouse.cursor.x
      const diffY = newState.mouse.cursor.y - state.mouse.cursor.y
      if (some(newState.widgets, (w) => w.selected)) {
        const selectedKeys = map(filter(newState.widgets, (w) => w.selected), (w) => w.editorKey)
        const newWidgets = selectedKeys.reduce(
          (acc, key) => {
            const movedWidget = update(newState.widgets[key], {
              x: { $sum: diffX / state.canvas.zoom },
              y: { $sum: diffY / state.canvas.zoom },
            })
            return { ...acc, [key]: movedWidget }
          },
          {}
        )
        console.log('xxx', newState.links, selectedKeys)
        const links = map(newState.links, (link) => {
          const moveLast = selectedKeys.find((key) => {
            return some(newState.widgets[key].outPorts, (port) => {console.log(port.editorKey, link.destination); return port.editorKey === link.destination}) ||
              some(newState.widgets[key].inPorts, (port) => {console.log(port.editorKey, link.destination); return port.editorKey === link.destination})
          })
          const moveFirst = selectedKeys.find((key) => {
            return some(newState.widgets[key].inPorts, (port) => {console.log(port.editorKey, link.source); return port.editorKey === link.source}) ||
              some(newState.widgets[key].outPorts, (port) => {console.log(port.editorKey, link.source); return port.editorKey === link.source})
          })
          let newLink = link
          if (moveFirst) {
            newLink = { ...newLink, path: [{ x: newLink.path[0].x + diffX / state.canvas.zoom, y: newLink.path[0].y + diffY / state.canvas.zoom }, ...newLink.path.slice(1)] }
          }
          if (moveLast) {
            const last = newLink.path[newLink.path.length - 1]
            newLink = { ...newLink, path: [...newLink.path.slice(0, newLink.path.length - 1), { x: last.x + diffX / state.canvas.zoom, y: last.y + diffY / state.canvas.zoom }] }
          }
          console.log('move', moveFirst, moveLast)
          return newLink
        })
        newState = { ...newState, widgets: { ...newState.widgets, ...newWidgets }, links }
      } else {
        newState = update(newState, {
          canvas: {
            offset: {
              x: { $sum: diffX },
              y: { $sum: diffY },
            },
          },
        })
      }
    }
    return newState
  },
})

const addPointToCurrentLink = (point) => ({
  type: 'Add point to current link',
  path: PATH_CURRENT_LINK,
  payload: point,
  reducer: (link) => ({ ...link, path: [...link.path, point] }),
})

export const onEditorMouseDown = (point) => (dispatch, getState) => {
  if (getState().editor.currentLink) {
    dispatch(addPointToCurrentLink(getRelativeMousePoint(getState().editor, point)))
  } else {
    dispatch(setSelectedWidget(-1))
  }
}

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  path: [...PATH_MOUSE, 'dragging'],
  reducer: (state) => false,
})

export const updateZoom = (deltaY, deltaScale) => ({
  type: 'Update zoom',
  path: [...PATH_CANVAS, 'zoom'],
  payload: { deltaY, deltaScale },
  reducer: (zoom) => Math.max(zoom + deltaY * deltaScale, 0),
})


export const setSelectedPort = (editorKey, point) => ({
  type: 'Set selected port',
  path: [...PATH_CURRENT_LINK],
  payload: { editorKey, point },
  reducer: (state) => {
    if (editorKey === -1) return undefined
    return {
      source: editorKey,
      path: [point],
      destination: undefined,
    }
  },
})

const addToLinks = (link) => ({
  type: 'Add to links',
  payload: link,
  path: PATH_LINKS,
  reducer: (links) => ({ ...links, [uniqueId()]: link }),
})

export const onPortMouseDown = (editorKey, event) => (dispatch, getState) => {
  const currentLink = currentLinkSelector(getState())
  dispatch(setSelectedWidget(-1))
  if (currentLink) {
    dispatch(addPointToCurrentLink(getRelativeMousePoint(getState().editor, { x: event.clientX, y: event.clientY })))
    if (currentLink.source !== editorKey) dispatch(addToLinks({ ...currentLinkSelector(getState()), destination: editorKey }))
    dispatch(setSelectedPort(-1))
  } else {
    dispatch(setSelectedPort(editorKey, getRelativeMousePoint(getState().editor, { x: event.clientX, y: event.clientY })))
  }
}

const selectLink = (link) => ({
  type: 'Select link',
  payload: link,
  path: PATH_LINKS,
  reducer: (links) => ({ ...links, [link]: { ...links[link], selected: true } }),
})

const computeDiff = (p1, p2, p3) => {
  return Math.abs(p1.x - p3.x) +
    Math.abs(p1.y - p3.y) +
    Math.abs(p2.x - p3.x) +
    Math.abs(p2.y - p3.y)
}

const addPointToLink = (link, event) => ({
  type: 'Add point to link',
  payload: { link, event },
  path: [],
  reducer: (state) => {
    const links = linksSelector(state)
    const path = links[link].path.slice(0), point = getRelativeMousePoint(state.editor, { x: event.clientX, y: event.clientY })
    const { pos } = path.reduce(
      (acc, value, index) => {
        if (index === 0) return acc
        if (computeDiff(path[index - 1], value, point) < acc.diff) {
          return {
            diff: computeDiff(path[index - 1], value, point),
            pos: index,
          }
        }
        return acc
      },
      { diff: Number.MAX_VALUE, pos: 0 }
    )
    path.splice(pos, 0, point)
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

export const onLinkMouseDown = (event, key) => (dispatch, getState) => {
  event.stopPropagation()
  if (event.ctrlKey) dispatch(selectLink(key))
  else dispatch(addPointToLink(key, event))
}

export const onPointMouseDown = (event, key, index) => ({
  type: 'Select link point',
  path: [],
  payload: { event, key, index },
  reducer: (state) => {
    event.stopPropagation()
    console.log('select point', key, index)
    return state
  },
})

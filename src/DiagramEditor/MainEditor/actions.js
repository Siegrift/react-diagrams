import { PATH_EDITOR, PATH_MOUSE, PATH_CANVAS, PATH_CURRENT_LINK, PATH_LINKS, currentLinkSelector, selectedNodesSelector, linksSelector } from './state'
import { uniqueId, reduce, some, map, filter, find } from 'lodash'
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


export const setSelectedNode = (nodeKey, onlyAppend) => ({
  type: 'Add to selected widgets',
  path: [...PATH_EDITOR],
  payload: { nodeKey, onlyAppend },
  reducer: (state) => {
    let widgetsState = state.widgets
    let linksState = state.links
    if (!onlyAppend) {
      widgetsState = reduce(
        widgetsState,
        (acc, value, key) => ({ ...acc, [key]: { ...value, selected: false } }),
        {}
      )
      linksState = reduce(
        linksState,
        (acc, value, key) => ({ ...acc, [key]: { ...value, selected: false } }),
        {}
      )
      linksState = reduce(
        linksState,
        (acc, value, key) => {
          return { ...acc, [key]: { ...value, path: value.path.map((point) => ({ ...point, selected: false })) } }
        },
        {}
      )
    }
    if (nodeKey !== -1) {
      if (widgetsState.hasOwnProperty(nodeKey)) {
        widgetsState = update(widgetsState, {
          [nodeKey]: {
            selected: {
              $apply: (selected) => !selected,
            },
          },
        })
      }
      if (linksState.hasOwnProperty(nodeKey)) {
        linksState = update(linksState, {
          [nodeKey]: {
            selected: {
              $apply: (selected) => !selected,
            },
          },
        })
      }
      if (find(linksState, ((link) => link.path.find((point) => point.editorKey === nodeKey)))) {
        const link = find(linksState, ((link) => link.path.find((point) => point.editorKey === nodeKey)))
        linksState = update(linksState, {
          [link.editorKey]: {
            path: {
              $set: link.path.map((point) => point.editorKey === nodeKey ? { ...point, selected: true } : point),
            },
          },
        })
      }
    }
    return { ...setDragging(state, true), widgets: widgetsState, links: linksState }
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
  path: [],
  payload: { position },
  notLogable: true,
  reducer: (state) => {
    let newState = update(state, {
      editor: {
        mouse: {
          cursor: { $set: getRelativePoint(state.editor.editorRef, position) },
        },
      },
    })
    if (newState.editor.mouse.dragging) {
      const diffX = newState.editor.mouse.cursor.x - state.editor.mouse.cursor.x
      const diffY = newState.editor.mouse.cursor.y - state.editor.mouse.cursor.y
      let shouldMoveCanvas = true
      if (some(newState.editor.widgets, (w) => w.selected)) {
        const selectedKeys = map(filter(newState.editor.widgets, (w) => w.selected), (w) => w.editorKey)
        const newWidgets = selectedKeys.reduce(
          (acc, key) => {
            const movedWidget = update(newState.editor.widgets[key], {
              x: { $sum: diffX / state.editor.canvas.zoom },
              y: { $sum: diffY / state.editor.canvas.zoom },
            })
            return { ...acc, [key]: movedWidget }
          },
          {}
        )
        const links = reduce(
          newState.editor.links,
          (acc, value, key) => {
            const moveLast = selectedKeys.find((key) => {
              return some(newState.editor.widgets[key].outPorts, (port) => port.editorKey === value.destination) ||
                some(newState.editor.widgets[key].inPorts, (port) => port.editorKey === value.destination)
            })
            const moveFirst = selectedKeys.find((key) => {
              return some(newState.editor.widgets[key].inPorts, (port) => port.editorKey === value.source) ||
                some(newState.editor.widgets[key].outPorts, (port) => port.editorKey === value.source)
            })
            let newLink = value
            if (moveFirst) {
              newLink = { ...newLink, path: [{ ...newLink.path[0], x: newLink.path[0].x + diffX / state.editor.canvas.zoom, y: newLink.path[0].y + diffY / state.editor.canvas.zoom }, ...newLink.path.slice(1)] }
            }
            if (moveLast) {
              const last = newLink.path[newLink.path.length - 1]
              newLink = { ...newLink, path: [...newLink.path.slice(0, newLink.path.length - 1), { ...last, x: last.x + diffX / state.editor.canvas.zoom, y: last.y + diffY / state.editor.canvas.zoom }] }
            }
            return { ...acc, [key]: newLink }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, widgets: { ...newState.editor.widgets, ...newWidgets }, links } }
        shouldMoveCanvas = false
      }

      if (some(newState.editor.links, (link) => link.selected)) {
        const selectedKeys = map(filter(newState.editor.links, (link) => link.selected), (link) => link.editorKey)
        const newLinks = selectedKeys.reduce(
          (acc, key) => {
            const movedLink = update(newState.editor.links[key], {
              path: {
                $set: newState.editor.links[key].path.map((point, index) => {
                  if (index === 0 || index === newState.editor.links[key].path.length - 1) return point
                  return { ...point, x: point.x + diffX / state.editor.canvas.zoom, y: point.y + diffY / state.editor.canvas.zoom }
                }),
              },
            })
            return { ...acc, [key]: movedLink }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, links: { ...newState.editor.links, ...newLinks } } }
        shouldMoveCanvas = false
      }

      if (some(newState.editor.links, (link) => some(link.path, (point) => point.selected))) {
        const newLinks = reduce(
          newState.editor.links,
          (acc, value, key) => {
            return {
              ...acc,
              [key]: {
                ...value,
                path: value.path.map((point) => {
                  if (point.selected) return { ...point, x: point.x + diffX / state.editor.canvas.zoom, y: point.y + diffY / state.editor.canvas.zoom }
                  else return point
                }),
              },
            }
          },
          {}
        )
        newState = { ...newState, editor: { ...newState.editor, links: newLinks } }
        shouldMoveCanvas = false
      }

      if (shouldMoveCanvas) {
        newState = update(newState, {
          editor: {
            canvas: {
              offset: {
                x: { $sum: diffX },
                y: { $sum: diffY },
              },
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
  reducer: (link) => ({ ...link, path: [...link.path, { ...point, editorKey: uniqueId(), selected: false }] }),
})

export const onEditorMouseDown = (point) => (dispatch, getState) => {
  if (getState().editor.currentLink) {
    dispatch(addPointToCurrentLink(getRelativeMousePoint(getState().editor, point)))
  } else {
    dispatch(setSelectedNode(-1))
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
      path: [],
      destination: undefined,
    }
  },
})

const addToLinks = (link) => ({
  type: 'Add to links',
  payload: link,
  path: PATH_LINKS,
  reducer: (links) => {
    const editorKey = uniqueId()
    return { ...links, [editorKey]: { ...link, selected: false, editorKey } }
  },
})

export const onPortMouseDown = (editorKey, event) => (dispatch, getState) => {
  const currentLink = currentLinkSelector(getState())
  dispatch(setSelectedNode(-1))
  if (currentLink) {
    dispatch(addPointToCurrentLink(getRelativeMousePoint(getState().editor, { x: event.clientX, y: event.clientY })))
    dispatch(addToLinks({ ...currentLinkSelector(getState()), destination: editorKey }))
    dispatch(setSelectedPort(-1))
  } else {
    dispatch(setSelectedPort(editorKey, getRelativeMousePoint(getState().editor, { x: event.clientX, y: event.clientY })))
    dispatch(addPointToCurrentLink(getRelativeMousePoint(getState().editor, { x: event.clientX, y: event.clientY })))
  }
}

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
  if (event.ctrlKey) dispatch(setSelectedNode(key, true))
  else dispatch(addPointToLink(key, event))
}

export const onPointMouseDown = (event, editorKey) => (dispatch) => {
  event.stopPropagation()
  dispatch(setSelectedNode(editorKey, event.ctrlKey))
}

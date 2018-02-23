import { PATH_EDITOR, PATH_MOUSE, PATH_CANVAS, PATH_WIDGETS } from './state'
import { uniqueId, reduce, some, map, filter } from 'lodash'
import update from '../../utils/update'

const setDragging = (editorState, isDragging) => update(editorState, {
  mouse: {
    dragging: { $set: isDragging },
  },
})

export const addWidget = (command, pos) => ({
  type: 'Add widget',
  path: [...PATH_WIDGETS],
  payload: { command, pos },
  reducer: (state) => {
    const id = uniqueId()
    return update(state, {
      [id]: { $set: { ...command, ...pos, editorKey: id, selected: false } },
    })
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
    if (widgetKey) {
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
  reducer: (state) => ref,
})

export const onEditorMouseMove = (position) => ({
  type: 'Editor mouse move',
  path: [...PATH_EDITOR],
  payload: { position },
  reducer: (state) => {
    let newState = update(state, {
      mouse: {
        cursor: { $set: position },
      },
    })
    if (newState.mouse.dragging) {
      const diffX = position.x - state.mouse.cursor.x
      const diffY = position.y - state.mouse.cursor.y
      console.log(diffX, diffY)
      if (some(newState.widgets, (w) => w.selected)) {
        const selectedKeys = map(filter(newState.widgets, (w) => w.selected), (w) => w.editorKey)
        const newWidgets = selectedKeys.reduce(
          (acc, key) => {
            const movedWidget = update(newState.widgets[key], {
              x: { $sum: diffX },
              y: { $sum: diffY },
            })
            return { ...acc, [key]: movedWidget }
          },
          {}
        )
        newState = { ...newState, widgets: { ...newState.widgets, ...newWidgets } }
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
  notLogable: true,
})

export const onEditorMouseDown = () => ({
  type: 'Editor mouse down',
  path: [...PATH_EDITOR],
  payload: undefined,
  reducer: (state) => {
    return setSelectedWidget(undefined).reducer(state)
  },
})

export const onEditorMouseUp = () => ({
  type: 'Editor mouse up',
  path: [...PATH_MOUSE, 'dragging'],
  payload: undefined,
  reducer: (state) => false,
})

export const updateZoom = (event, deltaScale) => ({
  type: 'Update zoom',
  path: [...PATH_CANVAS],
  payload: { event, deltaScale },
  reducer: (canvas) => {
    return update(canvas, {
      zoom: { $sum: event.deltaY * deltaScale },
    })
  },
})

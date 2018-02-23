import { PATH_EDITOR, PATH_MOUSE, PATH_CANVAS } from './state'
import { uniqueId } from 'lodash'
import update from '../../utils/update'

export const addWidget = (command, pos) => ({
  type: 'Add widget',
  path: [...PATH_EDITOR, 'widgets'],
  payload: { command, pos },
  reducer: (state) => update(state, {
    [uniqueId()]: { $set: { ...command, ...pos } },
  }),
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
    if (state.mouse.dragging) {
      console.log(position, state.mouse.cursor)
      newState = update(newState, {
        canvas: {
          offset: {
            x: { $sum: position.x - state.mouse.cursor.x },
            y: { $sum: position.y - state.mouse.cursor.y },
          },
        },
      })
    }
    return newState
  },
  notLogable: true,
})

export const setDragging = (dragging) => ({
  type: 'Set dragging',
  path: [...PATH_MOUSE, 'dragging'],
  payload: { dragging },
  reducer: (state) => dragging,
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

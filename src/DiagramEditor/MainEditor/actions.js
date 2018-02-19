import { PATH_EDITOR } from './state'
import { uniqueId } from 'lodash'
import update from 'immutability-helper'

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

// @flow
import type { StateDraft } from '../../flow/reduxTypes'
import type { AppliedEditorState } from './flow'

export const PATH_EDITOR = ['editor']
export const PATH_MOUSE = [...PATH_EDITOR, 'mouse']
export const PATH_CANVAS = [...PATH_EDITOR, 'canvas']
export const PATH_EDITOR_BOUNDS = [...PATH_EDITOR, 'editorBounds']
export const PATH_DRAGGING = [...PATH_MOUSE, 'dragging']
export const PATH_CURSOR = [...PATH_MOUSE, 'cursor']
export const PATH_ZOOM = [...PATH_CANVAS, 'zoom']
export const PATH_OFFSET = [...PATH_CANVAS, 'offset']

export const setInitialState = (state: StateDraft): StateDraft & AppliedEditorState => ({
  ...state,
  [PATH_EDITOR.toString()]: {
    mouse: {
      cursor: undefined,
      dragging: false,
    },
    canvas: {
      offset: {
        x: 0,
        y: 0,
      },
      zoom: 1,
    },
    editorBounds: undefined,
  },
})

// @flow
import type { BoundingBox } from '../../flow/commonTypes'

export type EditorState = {
  mouse: {
    cursor: {
      x: number,
      y: number,
    },
    dragging: boolean,
  },
  canvas: {
    offset: {
      x: number,
      y: number,
    },
    zoom: number,
  },
  editorBounds: BoundingBox,
}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedEditorState = { editor: EditorState }

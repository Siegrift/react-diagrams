// @flow
import { cancelSelection, deleteSelection, redo, undo } from './actions'

import type { Dispatch, GetState } from '../flow/reduxTypes'

export type Shortcut = {
  keyStroke: string,
  action: (dispatch: Dispatch, getState: GetState) => void,
}

export const shortcuts = [
  {
    keyStroke: 'Ctrl+KeyZ',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(undo()),
  },
  {
    keyStroke: 'Ctrl+Shift+KeyZ',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(redo()),
  },
  {
    keyStroke: 'Escape',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(cancelSelection()),
  },
  {
    keyStroke: 'Delete',
    action: (dispatch: Dispatch, getState: GetState) => dispatch(deleteSelection()),
  },
]

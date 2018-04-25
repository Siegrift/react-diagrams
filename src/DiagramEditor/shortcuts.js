import { undo, redo, cancelSelection, deleteSelection } from './actions'

const shortcuts = [
  {
    keyStroke: 'Ctrl+KeyZ',
    action: (dispatch) => dispatch(undo()),
  },
  {
    keyStroke: 'Ctrl+Shift+KeyZ',
    action: (dispatch) => dispatch(redo()),
  },
  {
    keyStroke: 'Escape',
    action: (dispatch) => dispatch(cancelSelection()),
  },
  {
    keyStroke: 'Delete',
    action: (dispatch) => dispatch(deleteSelection()),
  },
]

export default shortcuts

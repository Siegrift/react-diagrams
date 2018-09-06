import { setDragging, setSelectedNode } from '../mainEditor/actions'

export const onPointMouseDown = (event, editorKey) => (dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, event.ctrlKey))
}

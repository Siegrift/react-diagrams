import { setDragging, setSelectedNode } from '../actions'

export const onWidgetMouseDown = (editorKey, e) => (dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

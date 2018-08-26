import { setDragging, setSelectedNode } from '../mainEditor/actions'

export const onWidgetMouseDown = (editorKey, e) => (dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

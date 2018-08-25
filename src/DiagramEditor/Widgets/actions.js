import { setDragging, setSelectedNode } from '../MainEditor/actions'

export const onWidgetMouseDown = (editorKey, e) => (dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

// @flow
import { setDragging, setSelectedNode } from '../mainEditor/actions'

import type { Dispatch } from '../../reduxTypes'
import type { EditorKey } from '../../commonTypes'

export const onWidgetMouseDown = (editorKey: EditorKey, e: MouseEvent) => (dispatch: Dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

// @flow
import { setDragging, setSelectedNode } from '../mainEditor/actions'

import type { Dispatch } from '../../flow/reduxTypes'
import type { EditorKey } from '../../flow/commonTypes'

export const onWidgetMouseDown = (editorKey: EditorKey, e: MouseEvent) => (dispatch: Dispatch) => {
  dispatch(setDragging(true))
  dispatch(setSelectedNode(editorKey, e.ctrlKey))
}

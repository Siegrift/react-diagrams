import { setIn } from 'immutable'
import { uniqueId } from 'lodash'
import { PATH_LINKS, currentLinkSelector } from '../state'
import { setDragging, cancelCurrentSelection, setSelectedPort } from '../actions'
import { addPointToCurrentLink } from '../Link/actions'

const addToLinks = (link) => ({
  type: 'Add to links',
  payload: link,
  reducer: (state) => {
    const editorKey = uniqueId()
    return setIn(state, [...PATH_LINKS, editorKey], { ...link, selected: false, editorKey })
  },
})

export const onPortMouseDown = (editorKey, event) => (dispatch, getState) => {
  const currentLink = currentLinkSelector(getState())
  const point = { x: event.clientX, y: event.clientY }
  dispatch(setDragging(true))
  dispatch(cancelCurrentSelection())
  if (currentLink) {
    dispatch(addPointToCurrentLink(point))
    dispatch(addToLinks({ ...currentLinkSelector(getState()), destination: editorKey }))
    dispatch(setSelectedPort(-1))
  } else {
    dispatch(setSelectedPort(editorKey, point))
    dispatch(addPointToCurrentLink(point))
  }
}

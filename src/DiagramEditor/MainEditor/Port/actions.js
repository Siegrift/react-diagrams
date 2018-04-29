import { setIn } from 'immutable'
import { uniqueId, map, flatten, concat } from 'lodash'
import { PATH_LINKS, currentLinkSelector, widgetsSelector } from '../state'
import { cancelCurrentSelection, setSelectedPort } from '../actions'
import { addPointToCurrentLink } from '../Link/actions'

export const isValidLinkDefault = (source, destination) => {
  return !source.isInPort && destination.isInPort
}

const getLinkDataByEditorKey = (state, editorKey) => {
  const ports = flatten(map(widgetsSelector(state), (widget) => {
    return concat(
      map(widget.inPorts, (port) => ({ ...port, isInPort: true })),
      map(widget.outPorts, (port) => ({ ...port, isInPort: false })),
    )
  }))
  return ports.find((port) => port.editorKey === editorKey)
}

const isInvalidLink = (state, sourceEditorKey, destinationEditorKey, linkChecker) => {
  const source = getLinkDataByEditorKey(state, sourceEditorKey)
  const destination = getLinkDataByEditorKey(state, destinationEditorKey)
  return !linkChecker(source, destination)
}

const addToLinks = (link) => ({
  type: 'Add to links',
  payload: link,
  undoable: true,
  reducer: (state) => {
    const editorKey = uniqueId()
    return setIn(state, [...PATH_LINKS, editorKey], { ...link, selected: false, editorKey })
  },
})

export const onPortMouseDown = (editorKey, event, linkChecker) => (dispatch, getState) => {
  const currentLink = currentLinkSelector(getState())
  const point = { x: event.clientX, y: event.clientY }
  dispatch(cancelCurrentSelection())
  if (currentLink) {
    if (isInvalidLink(getState(), currentLink.source, editorKey, linkChecker)) return
    dispatch(addPointToCurrentLink(point, () => false))
    dispatch(addToLinks({ ...currentLinkSelector(getState()), destination: editorKey }))
    dispatch(setSelectedPort(-1))
  } else {
    dispatch(setSelectedPort(editorKey, point))
    dispatch(addPointToCurrentLink(point))
  }
}

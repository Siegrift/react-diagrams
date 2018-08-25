import { currentLinkSelector } from '../Links/selectors'
import { concat } from 'lodash'

import { setIn } from 'immutable'

import { cancelCurrentSelection, setSelectedPort } from '../MainEditor/actions'
import { addPointToCurrentLink, addToLinks, isInvalidLink } from '../Links/actions'
import { PATH_PORTS } from './state'
import { getPorts } from './selectors'

export const isValidLinkDefault = (source, destination) => {
  return !source.isInPort && destination.isInPort
}

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

export const addPorts = (inPorts, outPorts) => ({
  type: 'Add ports',
  undoable: false,
  payload: { inPorts, outPorts },
  reducer: (state) => {
    const ports = concat(inPorts, outPorts)
    return setIn(state, PATH_PORTS, {
      ...getPorts(state),
      ...ports.reduce((acc, port) => {
        return { ...acc, [port.editorKey]: port }
      }, {}),
    })
  },
})

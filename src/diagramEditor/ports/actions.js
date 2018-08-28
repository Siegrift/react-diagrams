import { currentLinkSelector } from '../links/selectors'
import { concat } from 'lodash'

import { setIn } from 'immutable'

import { cancelCurrentSelection, setSelectedPort } from '../mainEditor/actions'
import { addPointToCurrentLink, addToLinks, isInvalidLink } from '../links/actions'
import { PATH_PORTS } from './state'
import { portsSelector } from './selectors'

export const isValidLinkDefault = (
  sourcePort,
  sourceWidget,
  destinationPort,
  destinationWidget
) => {
  return !sourcePort.isInPort && destinationPort.isInPort
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
      ...portsSelector(state),
      ...ports.reduce((acc, port) => {
        return { ...acc, [port.editorKey]: port }
      }, {}),
    })
  },
})

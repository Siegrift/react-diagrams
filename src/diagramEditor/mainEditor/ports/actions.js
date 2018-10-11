// @flow
import { currentLinkSelector } from '../links/selectors'
import { concat } from 'lodash'

import { setIn } from '../../../imuty'

import { cancelCurrentSelection, setSelectedPort } from '../../mainEditor/actions'
import { addPointToCurrentLink, addLink } from '../links/actions'
import { isInvalidLink } from '../links/linkUtils'
import { PATH_PORTS } from './state'
import { portsSelector } from './selectors'
import { checkpoint } from '../../../generalActions'

import type { EditorKey } from '../../../flow/commonTypes'
import type { Dispatch, GetState, State } from '../../../flow/reduxTypes'
import type { Port } from './flow'

export const onPortMouseDown = (editorKey: EditorKey, event: MouseEvent, linkChecker: Function) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const currentLink = currentLinkSelector(getState())
  const point = { x: event.clientX, y: event.clientY }
  dispatch(cancelCurrentSelection())
  if (currentLink) {
    if (isInvalidLink(getState(), currentLink.source, editorKey, linkChecker)) return
    dispatch(addPointToCurrentLink(point, false))
    dispatch(addLink({ ...currentLinkSelector(getState()), target: editorKey }))
    dispatch(setSelectedPort(-1))
    dispatch(checkpoint())
  } else {
    dispatch(setSelectedPort(editorKey, point))
    dispatch(addPointToCurrentLink(point))
  }
}

export const addPorts = (inPorts: Port[], outPorts: Port[]) => ({
  type: 'Add ports',
  undoable: false,
  payload: { inPorts, outPorts },
  reducer: (state: State) => {
    const ports: Port[] = concat(inPorts, outPorts)
    return setIn(state, PATH_PORTS, {
      ...portsSelector(state),
      ...ports.reduce((acc: Object, port: Port) => {
        return { ...acc, [port.editorKey]: port }
      }, {}),
    })
  },
})

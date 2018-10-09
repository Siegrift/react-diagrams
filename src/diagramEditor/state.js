// @flow
import { get } from 'lodash'
import { createSelector } from 'reselect'
import { selectedNodesSelector } from './mainEditor/selectors'
import { currentLinkSelector } from './links/selectors'

import type { StateDraft } from '../initialState'
import type { State } from '../flow/reduxTypes'
import type { CurrentLink } from './links/state'

export const PATH_APP = ['app']
export const PATH_HISTORY = [...PATH_APP, 'history']
export const PATH_HISTORY_INDEX = [...PATH_APP, 'historyIndex']

export type AppState = {
  history: any[],
  historyIndex: number,
}
// NOTE: Needs to be updated when PATH in state changes
export type AppliedAppState = { app: AppState }

export const setInitialState = (state: StateDraft): StateDraft & AppliedAppState => ({
  ...state,
  [PATH_APP.toString()]: {
    history: [],
    // -1 because when editor is initialized, we trigger a save (so there is a base history state)
    historyIndex: -1,
  },
})

export const undoableSelector = (state: State) => {
  const index = get(state, PATH_HISTORY_INDEX)
  return index > 0
}

export const redoableSelector = (state: State) => {
  const history = [...get(state, PATH_HISTORY)],
    index = get(state, PATH_HISTORY_INDEX)
  return index < history.length - 1
}

export const cancelableSelector = createSelector(
  currentLinkSelector,
  selectedNodesSelector,
  // FLOW: flow selectedNodes properly
  (currentLink: CurrentLink, selectedNodes: any) => {
    return currentLink || selectedNodes.length
  }
)

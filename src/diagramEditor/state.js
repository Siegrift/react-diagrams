// @flow
import { get } from 'lodash'
import { createSelector } from 'reselect'
import { LOCAL_STORAGE_PATH } from '../constants'
import { selectedNodesSelector } from './mainEditor/selectors'
import { currentLinkSelector } from './links/selectors'

import type { StateDraft } from '../initialState'
import type { State } from '../reduxTypes'
import type { CurrentLink } from './links/state'

export const PATH_APP = ['app']
export const PATH_TOPBAR_HEIGHT = [...PATH_APP, 'topbarHeight']
export const PATH_SIDEBAR_WIDTH = [...PATH_APP, 'sidebarWidth']
export const PATH_HISTORY = [...PATH_APP, 'history']
export const PATH_HISTORY_INDEX = [...PATH_APP, 'historyIndex']

export type AppState = {
  topbarHeight: number,
  sidebarWidth: number,
  history: any[],
  historyIndex: number,
}
// NOTE: Needs to be updated when PATH in state changes
export type AppliedAppState = { app: AppState }

export const setInitialState = (state: StateDraft): StateDraft & AppliedAppState => ({
  ...state,
  [PATH_APP.toString()]: {
    topbarHeight: 40,
    sidebarWidth: 200,
    history: [],
    historyIndex: -1,
  },
})

// TODO: move to selectors
export const topbarHeightSelector = (state: State) => get(state, PATH_TOPBAR_HEIGHT)
export const sidebarWidthSelector = (state: State) => get(state, PATH_SIDEBAR_WIDTH)

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

export const loadAvailableSelector = (state: State) =>
  localStorage.getItem(LOCAL_STORAGE_PATH) !== null

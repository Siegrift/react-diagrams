import { get } from 'lodash'

export const PATH_APP = ['app']
export const PATH_TOPBAR_HEIGHT = [...PATH_APP, 'topbarHeight']
export const PATH_SIDEBAR_WIDTH = [...PATH_APP, 'sidebarWidth']
export const PATH_HISTORY = [...PATH_APP, 'history']
export const PATH_HISTORY_INDEX = [...PATH_APP, 'historyIndex']

export const setInitialState = (state) => ({
  ...state,
  [PATH_APP]: {
    topbarHeight: 40,
    sidebarWidth: 200,
    history: [],
    historyIndex: -1,
  },
})

export const topbarHeightSelector = (state) => get(state, PATH_TOPBAR_HEIGHT)
export const sidebarWidthSelector = (state) => get(state, PATH_SIDEBAR_WIDTH)

export const undoableSelector = (state) => {
  const index = get(state, PATH_HISTORY_INDEX)
  return index > 0
}

export const redoableSelector = (state) => {
  const history = [...get(state, PATH_HISTORY)], index = get(state, PATH_HISTORY_INDEX)
  return index < history.length - 1
}

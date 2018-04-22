import { get } from 'lodash'

export const PATH_APP = ['app']
export const PATH_TOPBAR_HEIGHT = [...PATH_APP, 'topbarHeight']
export const PATH_SIDEBAR_WIDTH = [...PATH_APP, 'sidebarWidth']

export const setInitialState = (state) => ({
  ...state,
  [PATH_APP]: {
    topbarHeight: 30,
    sidebarWidth: 200,
  },
})

export const topbarHeightSelector = (state) => get(state, PATH_TOPBAR_HEIGHT)
export const sidebarWidthSelector = (state) => get(state, PATH_SIDEBAR_WIDTH)

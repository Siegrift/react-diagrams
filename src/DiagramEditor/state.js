import { setIn, getIn } from '../utils/helpers'

export const PATH_APP = ['app']

export const setInitialState = (state) =>
  setIn(state, PATH_APP, {
    topbarHeight: 30,
    sidebarWidth: 200,
  }, true)

export const topbarHeightSelector = (state) => getIn(state, [...PATH_APP, 'topbarHeight'])
export const sidebarWidthSelector = (state) => getIn(state, [...PATH_APP, 'sidebarWidth'])

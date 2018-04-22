import { PATH_APP, PATH_TOPBAR_HEIGHT, PATH_SIDEBAR_WIDTH } from './state'
import { setIn } from 'immutable'

export const changeTopbarHeight = (height) => ({
  type: 'Change topbar height',
  payload: height,
  reducer: (state) => setIn(state, PATH_TOPBAR_HEIGHT, height),
})

export const changeSidebarWidth = (width) => ({
  type: 'Change sidebar width',
  payload: width,
  reducer: (state) => setIn(state, PATH_SIDEBAR_WIDTH, width),
})

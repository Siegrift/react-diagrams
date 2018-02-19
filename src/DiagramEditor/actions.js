import { PATH_APP } from './state'

export const changeTopbarHeight = (height) => ({
  type: 'Change topbar height',
  path: [...PATH_APP, 'topbarHeight'],
  payload: height,
  reducer: (state) => height,
})

export const changeSidebarWidth = (width) => ({
  type: 'Change sidebar width',
  path: [...PATH_APP, 'sidebarWidth'],
  payload: width,
  reducer: (state) => width,
})

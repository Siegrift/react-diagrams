// TODO: use this as default props and put it inside corresponding folders
export const DATA_TRANSFER_WIDGET_KEY = 'widget_key'
export const SELECTED_PATH_POINT_RADIUS = 10
export const PATH_POINT_RADIUS = 5
export const MIN_ZOOM = 0.0001

export const undoRedoFilter = {
  app: {
    sidebarWidth: true,
    topbarHeight: true,
  },
  editor: {
    canvas: true,
    currentLink: true,
    links: true,
    mouse: {
      cursor: true,
    },
    widgets: true,
  },
}

export const saveFilter = {
  app: {
    sidebarWidth: true,
    topbarHeight: true,
  },
  editor: {
    canvas: true,
    currentLink: true,
    links: true,
    mouse: {
      cursor: true,
    },
    widgets: true,
  },
}

export const LOCAL_STORAGE_PATH = 'diagramEditorState'

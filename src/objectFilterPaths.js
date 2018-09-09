// @flow
import { PATH_TOPBAR_HEIGHT, PATH_SIDEBAR_WIDTH } from './diagramEditor/state'
import { PATH_ZOOM, PATH_CANVAS, PATH_OFFSET } from './diagramEditor/mainEditor/state'
import { PATH_LINKS, PATH_CURRENT_LINK } from './diagramEditor/links/state'
import { PATH_PORTS } from './diagramEditor/ports/state'
import { PATH_LINK_POINTS } from './diagramEditor/linkPoints/state'
import { PATH_WIDGETS } from './diagramEditor/widgets/state'

/** NOTE: The filters are not the same! */

export const undoRedoFilters = [
  PATH_SIDEBAR_WIDTH,
  PATH_TOPBAR_HEIGHT,
  PATH_CANVAS,
  PATH_ZOOM,
  PATH_OFFSET,
  PATH_LINKS,
  PATH_CURRENT_LINK,
  PATH_PORTS,
  PATH_LINK_POINTS,
  PATH_WIDGETS,
]

export const saveFilters = [
  PATH_SIDEBAR_WIDTH,
  PATH_TOPBAR_HEIGHT,
  PATH_CANVAS,
  PATH_ZOOM,
  PATH_OFFSET,
  PATH_LINKS,
  PATH_CURRENT_LINK,
  PATH_PORTS,
  PATH_LINK_POINTS,
  PATH_WIDGETS,
]

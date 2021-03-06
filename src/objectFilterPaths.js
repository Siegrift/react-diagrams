// @flow
import { PATH_ZOOM, PATH_CANVAS, PATH_OFFSET } from './diagramEditor/mainEditor/state'
import { PATH_LINKS, PATH_CURRENT_LINK } from './diagramEditor/mainEditor/links/state'
import { PATH_PORTS } from './diagramEditor/mainEditor/ports/state'
import { PATH_LINK_POINTS } from './diagramEditor/mainEditor/linkPoints/state'
import { PATH_WIDGETS } from './diagramEditor/mainEditor/widgets/state'

const COMMON_FILTERS = [
  PATH_CANVAS,
  PATH_ZOOM,
  PATH_OFFSET,
  PATH_LINKS,
  PATH_CURRENT_LINK,
  PATH_PORTS,
  PATH_LINK_POINTS,
  PATH_WIDGETS,
]

export const UNDO_REDO_FILTERS = [...COMMON_FILTERS]

export const SAVE_FILTERS = [...COMMON_FILTERS]

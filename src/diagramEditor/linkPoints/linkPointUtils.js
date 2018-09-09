// @flow
import { uniqueId } from 'lodash'

import type { Position } from '../../flow/commonTypes'

export const createDefaultLinkPoint = (position: Position, isVisible: boolean = true) => ({
  ...position,
  editorKey: uniqueId(),
  selected: false,
  visible: isVisible,
})

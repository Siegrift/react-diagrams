// @flow
import { pick } from 'lodash'
import type { BoundingBox } from '../../flow/commonTypes'

// properties in a DOMRect are available through prototype and are not compared by lodash isEqual.
export const extractBoundingBox = (bounds: DOMRect): BoundingBox => {
  return pick(bounds, ['x', 'y', 'width', 'height', 'top', 'bottom', 'left', 'right'])
}

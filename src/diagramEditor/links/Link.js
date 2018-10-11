import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import LinkPoint from '../linkPoints/LinkPoint'
import { onLinkMouseDown, addPointToCurrentLink } from './actions'
import { linkPointsByEditorKeysSelector } from '../linkPoints/selectors'
import './_Link.scss'

// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  }
}

// Position of a control point
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current, previous, next, reverse) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  const smoothing = 0.2

  // Properties of the opposed-line
  const o = line(p, n)

  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing

  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
const bezierCommand = (point, i, a) => {
  // start control point
  const cps = controlPoint(a[i - 1], a[i - 2], point)

  // end control point
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

const Link = ({
  points,
  onLinkMouseDown,
  addPointToCurrentLink,
  currentLink,
  selected,
  editorKey,
  cursor,
}) => {
  const mergedPoints = cursor ? [...points, cursor] : points
  const path = mergedPoints.map((point) => [point.x, point.y])
  // build the d attributes by looping over the points
  const d = path.reduce(
    (acc, point, i, a) =>
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${bezierCommand(point, i, a)}`,
    ''
  )
  return (
    <g>
      <defs>
        <marker id="arrow" markerWidth="5" markerHeight="5" refX="1" refY="3" orient="auto">
          <path
            d="M1,1 L1,5 L5,3 L1,1"
            className={classNames({
              MarkerEnd: selected,
            })}
          />
        </marker>
      </defs>
      <path
        markerEnd="url(#arrow)"
        className={classNames('Editor__Inner__SvgEditor__Path', {
          Editor__Inner__SvgEditor__Path__selected: selected,
          Editor__Inner__SvgEditor__Path__hoverable: !currentLink,
        })}
        d={d}
        onMouseDown={(e) => {
          // for some strange bug the event was not fired on a current link
          // mouse down event for current link is handled in MainEditor
          if (!currentLink) {
            onLinkMouseDown(e, editorKey)
            e.stopPropagation()
          }
        }}
      />
      {mergedPoints.map((point) => <LinkPoint point={point} key={point.editorKey} />)}
    </g>
  )
}

export default connect(
  (state, { points }) => ({
    points: linkPointsByEditorKeysSelector(points)(state),
  }),
  {
    onLinkMouseDown,
    addPointToCurrentLink,
  }
)(Link)

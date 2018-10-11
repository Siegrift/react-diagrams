import React from 'react'
import './_LinkPoint.scss'
import classNames from 'classnames'
import { PATH_POINT_RADIUS, SELECTED_PATH_POINT_RADIUS } from '../../constants'
import { onPointMouseDown } from './actions'
import { connect } from 'react-redux'

const LinkPoint = ({ point, onPointMouseDown }) => (
  <circle
    className={classNames('LinkPoint', {
      LinkPoint__selected: point.selected,
      LinkPoint__hidden: !point.visible,
    })}
    cx={point.x}
    cy={point.y}
    r={point.selected ? SELECTED_PATH_POINT_RADIUS : PATH_POINT_RADIUS}
    onMouseDown={(event) => {
      event.stopPropagation()
      onPointMouseDown(event, point.editorKey)
    }}
  />
)

export default connect(
  null,
  { onPointMouseDown }
)(LinkPoint)

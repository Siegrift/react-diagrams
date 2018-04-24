import React from 'react'
import classnames from 'classnames'
import './_Port.scss'
import { connect } from 'react-redux'
import { onPortMouseDown } from './actions.js'

const Port = ({ className, isInPort, name, type, editorKey, onPortMouseDown }) => {
  return (
    <div
      className={classnames(className, 'DiagramPort', isInPort ? 'DiagramPort__In' : 'DiagramPort__Out')}
      onMouseDown={(e) => {
        e.stopPropagation()
        onPortMouseDown(editorKey, e)
      }}
    >
      <div className={'DiagramPort__Label'}>
        {name}
        {` (${type})`}
      </div>
    </div>
  )
}

export default connect(
  null,
  { onPortMouseDown },
)(Port)

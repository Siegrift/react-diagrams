import React from 'react'
import classnames from 'classnames'
import './_Port.scss'
import { connect } from 'react-redux'
import { onPortMouseDown, isValidLinkDefault } from './actions.js'

const Port = ({ className, isInPort, name, type, editorKey, onPortMouseDown, sidePanel, isValidLink }) => {
  return (
    <div
      className={classnames(className, 'DiagramPort', isInPort ? 'DiagramPort__In' : 'DiagramPort__Out')}
      onMouseDown={(e) => {
        if (sidePanel) return
        e.stopPropagation()
        onPortMouseDown(editorKey, e, isValidLink || isValidLinkDefault)
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

import React from 'react'
import classnames from 'classnames'
import './_DefaultDiagramPort.scss'
import { connect } from 'react-redux'
import { onPortMouseDown, setSelectedWidget } from '../../DiagramEditor/MainEditor/actions'

const DefaultDiagramPort = ({ className, isInPort, name, type, editorKey, onPortMouseDown, setSelectedWidget }) => {
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
  { onPortMouseDown, setSelectedWidget },
)(DefaultDiagramPort)

import React from 'react'
import classnames from 'classnames'
import './_DefaultDiagramPort.scss'

const DefaultDiagramPort = ({ className, isInPort, name, type }) => {
  return (
    <div className={classnames(className, 'DiagramPort', isInPort ? 'DiagramPort__In' : 'DiagramPort__Out')}>
      <div className={'DiagramPort__Label'}>
        {name}
        {` (${type})`}
      </div>
    </div>
  )
}

export default DefaultDiagramPort

import React from 'react'
import classnames from 'classnames'
import './_Port.scss'
import { connect } from 'react-redux'
import { onPortMouseDown } from './actions'
import { isValidLinkDefault } from './portUtils'
import FormLabel from '@material-ui/core/FormLabel'

// TODO: valid link not part of the port
const Port = ({
  isSidePanel,
  isInPort,
  name,
  type,
  editorKey,
  onPortMouseDown,
  isValidLink,
  selected,
}) => {
  return (
    <FormLabel
      style={{ textAlign: isInPort ? 'left' : 'right' }}
      className={classnames(
        { DiagramPort__selected: selected },
        isSidePanel ? 'DiagramPort__SidePanel' : 'DiagramPort__hoverable',
        'DiagramPort'
      )}
      onMouseDown={(e) => {
        if (!editorKey) return
        e.stopPropagation()
        onPortMouseDown(editorKey, e, isValidLink || isValidLinkDefault)
      }}
    >
      <span className="DiagramPort__Label">
        <b>{name}</b>
        <span>{` (${type})`}</span>
      </span>
    </FormLabel>
  )
}

export default connect(
  null,
  { onPortMouseDown }
)(Port)

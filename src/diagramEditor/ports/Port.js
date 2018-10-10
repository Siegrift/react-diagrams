import React from 'react'
import classnames from 'classnames'
import './_Port.scss'
import { connect } from 'react-redux'
import { onPortMouseDown } from './actions'
import { isValidLinkDefault } from './portUtils'
import Radio from '@material-ui/core/Radio'
import FormControlLabel from '@material-ui/core/FormControlLabel'

// TODO: valid link not part of the port
const Port = ({ className, isInPort, name, type, editorKey, onPortMouseDown, isValidLink }) => {
  return (
    <FormControlLabel
      style={{ margin: 0, textAlign: isInPort ? 'left' : 'right' }}
      className={classnames(className, 'DiagramPort')}
      onMouseDown={(e) => {
        if (!editorKey) return
        e.stopPropagation()
        onPortMouseDown(editorKey, e, isValidLink || isValidLinkDefault)
      }}
      control={
        // TODO: make use of property checked
        <Radio checked={false} style={{ padding: isInPort ? '0 0.3em 0 0' : '0 0 0 0.3em' }} />
      }
      label={
        <span>
          <b>{name}</b>
          <span>{` (${type})`}</span>
        </span>
      }
      labelPlacement={isInPort ? 'end' : 'start'}
    />
  )
}

export default connect(
  null,
  { onPortMouseDown }
)(Port)

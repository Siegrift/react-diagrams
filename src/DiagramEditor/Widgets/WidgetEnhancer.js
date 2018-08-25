import React from 'react'
import { onWidgetMouseDown } from './actions'
import Widget from './Widget'
import { connect } from 'react-redux'
import { portByEditorKeySelector } from '../Ports/selectors'

const WidgetEnhancer = ({ widget, inPorts, outPorts, onWidgetMouseDown }) => (
  <Widget
    {...widget}
    inPorts={inPorts}
    outPorts={outPorts}
    onMouseDown={(event) => {
      event.stopPropagation()
      onWidgetMouseDown(widget.key, event)
    }}
  />
)

export default connect(
  (state, { widget }) => ({
    inPorts: widget.inPortKeys.map((key) => portByEditorKeySelector(state, key)),
    outPorts: widget.outPortKeys.map((key) => portByEditorKeySelector(state, key)),
  }),
  { onWidgetMouseDown }
)(WidgetEnhancer)

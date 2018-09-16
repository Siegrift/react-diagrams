// @flow
import React from 'react'
import { onWidgetMouseDown } from './actions'
import WidgetComponent from './Widget'
import { connect } from 'react-redux'
import { portByEditorKeySelector } from '../ports/selectors'

import type { Widget } from './state'
import type { Port } from '../ports/state'
import type { EditorKey } from '../../flow/commonTypes'
import type { State } from '../../flow/reduxTypes'

type Props = {
  widget: Widget,
}

type ConnectedProps = Props & {
  inPorts: Port[],
  outPorts: Port[],
  onWidgetMouseDown: Function,
}

const WidgetEnhancer = ({ widget, inPorts, outPorts, onWidgetMouseDown }: ConnectedProps) => (
  <WidgetComponent
    {...widget}
    inPorts={inPorts}
    outPorts={outPorts}
    onMouseDown={(event: MouseEvent) => {
      event.stopPropagation()
      onWidgetMouseDown(widget.editorKey, event)
    }}
  />
)

export default connect(
  (state: State, { widget }: Props) => ({
    inPorts: widget.inPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
    outPorts: widget.outPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
  }),
  { onWidgetMouseDown }
)(WidgetEnhancer)

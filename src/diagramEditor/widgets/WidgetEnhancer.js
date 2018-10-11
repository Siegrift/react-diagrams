// @flow
import React from 'react'
import { onWidgetMouseDown } from './actions'
import WidgetComponent from './Widget'
import { connect } from 'react-redux'
import { portByEditorKeySelector } from '../ports/selectors'
import classNames from 'classnames'
import { draggingSelector } from '../mainEditor/selectors'

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
  isDragging: boolean,
}

const WidgetEnhancer = ({
  widget,
  inPorts,
  outPorts,
  onWidgetMouseDown,
  isDragging,
}: ConnectedProps) => (
  <WidgetComponent
    {...widget}
    inPorts={inPorts}
    outPorts={outPorts}
    onMouseDown={(event: MouseEvent) => {
      event.stopPropagation()
      onWidgetMouseDown(widget.editorKey, event)
    }}
    className={classNames({ 'DiagramWidget--grabbing': isDragging })}
  />
)

export default connect(
  (state: State, { widget }: Props) => ({
    isDragging: draggingSelector(state),
    inPorts: widget.inPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
    outPorts: widget.outPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
  }),
  { onWidgetMouseDown }
)(WidgetEnhancer)

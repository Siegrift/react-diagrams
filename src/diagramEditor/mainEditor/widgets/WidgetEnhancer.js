// @flow
import React from 'react'
import { onWidgetMouseDown } from './actions'
import WidgetComponent from './Widget'
import { connect } from 'react-redux'
import { portByEditorKeySelector } from '../ports/selectors'
import classNames from 'classnames'
import { draggingSelector } from '../../mainEditor/selectors'
import { currentLinkSourceSelector } from '../../mainEditor/links/selectors'

import type { Widget } from './flow'
import type { Port } from '../ports/flow'
import type { EditorKey } from '../../../flow/commonTypes'
import type { State } from '../../../flow/reduxTypes'

type Props = {
  widget: Widget,
}

type ConnectedProps = Props & {
  inPorts: Port[],
  outPorts: Port[],
  onWidgetMouseDown: Function,
  isDragging: boolean,
  currentLinkSource: EditorKey,
}

const WidgetEnhancer = ({
  widget,
  inPorts,
  outPorts,
  onWidgetMouseDown,
  isDragging,
  currentLinkSource,
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
    currentLinkSource={currentLinkSource}
  />
)

export default connect(
  (state: State, { widget }: Props) => ({
    isDragging: draggingSelector(state),
    inPorts: widget.inPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
    outPorts: widget.outPortKeys.map((key: EditorKey) => portByEditorKeySelector(state, key)),
    currentLinkSource: currentLinkSourceSelector(state),
  }),
  { onWidgetMouseDown }
)(WidgetEnhancer)

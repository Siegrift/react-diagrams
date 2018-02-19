import React from 'react'
import classnames from 'classnames'
import './_MainEditor.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { connect } from 'react-redux'
import { widgetsSelector, editorRefSelector } from './state'
import { addWidget, setEditorRef } from './actions'
import DefaultDiagramWidget from '../../defaults/DefaultDiagramWidget'

const getRelativePoint = ({ x, y }, boundingRect) => {
  return { x: x - boundingRect.left, y: y - boundingRect.top }
}

const MainEditor = ({ schema, widgets, addWidget, setEditorRef, editorRef }) => (
  <div
    ref={ref => ref && setEditorRef(ref)}
    onDrop={event => {
      const dataKey = event.dataTransfer.getData(DATA_TRANSFER_WIDGET_KEY)
      const command = schema.commands.find(c => c.key === dataKey)
      const pos = getRelativePoint({ x: event.clientX, y: event.clientY }, editorRef.getBoundingClientRect())
      addWidget(command, pos)
    }}
    className={classnames('editor')}
    onDragOver={event => event.preventDefault()}
  >
    {Object.keys(widgets).map((key) => (
      <DefaultDiagramWidget {...widgets[key]} key={key} />
    ))}
  </div>
)

export default connect(
  (state) => ({
    widgets: widgetsSelector(state),
    editorRef: editorRefSelector(state),
  }),
  { addWidget, setEditorRef },
)(MainEditor)

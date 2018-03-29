import React from 'react'
import classnames from 'classnames'
import './_MainEditor.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { connect } from 'react-redux'
import { widgetsSelector, editorRefSelector, zoomSelector, offsetSelector } from './state'
import {
  addWidget,
  setEditorRef,
  onEditorMouseMove,
  onEditorMouseDown,
  updateZoom,
  onEditorMouseUp,
} from './actions'
import DefaultDiagramWidget from '../../defaults/DefaultDiagramWidget'

const MainEditor = ({
  schema,
  widgets,
  addWidget,
  setEditorRef,
  editorRef,
  onEditorMouseMove,
  onEditorMouseDown,
  onEditorMouseUp,
  updateZoom,
  zoom,
  offset,
}) => (
  <div
    ref={(ref) => ref && setEditorRef(ref)}
    onDrop={(event) => {
      const dataKey = event.dataTransfer.getData(DATA_TRANSFER_WIDGET_KEY)
      const command = schema.commands.find((c) => c.key === dataKey)
      addWidget(command, { x: event.clientX, y: event.clientY })
    }}
    className={classnames('editor')}
    onDragOver={(event) => event.preventDefault()}
    onMouseMove={(e) => onEditorMouseMove({ x: e.clientX, y: e.clientY })}
    onMouseDown={(e) => onEditorMouseDown()}
    onMouseUp={(e) => onEditorMouseUp()}
    onWheel={(e) => updateZoom(e.deltaY, 0.001)}
  >
    <div
      className={classnames('editor__inner')}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {Object.keys(widgets).map((key) => (
        <DefaultDiagramWidget {...widgets[key]} key={key} />
      ))}
    </div>
  </div>
)

export default connect(
  (state) => ({
    widgets: widgetsSelector(state),
    editorRef: editorRefSelector(state),
    zoom: zoomSelector(state),
    offset: offsetSelector(state),
  }),
  {
    addWidget,
    setEditorRef,
    onEditorMouseMove,
    onEditorMouseDown,
    onEditorMouseUp,
    updateZoom,
  },
)(MainEditor)

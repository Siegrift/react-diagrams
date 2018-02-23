import React from 'react'
import classnames from 'classnames'
import './_MainEditor.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { connect } from 'react-redux'
import { widgetsSelector, editorRefSelector, zoomSelector, offsetSelector } from './state'
import { addWidget, setEditorRef, onEditorMouseMove, setDragging, updateZoom } from './actions'
import DefaultDiagramWidget from '../../defaults/DefaultDiagramWidget'

const getRelativePoint = ({ x, y }, editorRef) => {
  const boundingRect = editorRef.getBoundingClientRect()
  return { x: x - boundingRect.left, y: y - boundingRect.top }
}

const MainEditor = ({
  schema,
  widgets,
  addWidget,
  setEditorRef,
  editorRef,
  onEditorMouseMove,
  setDragging,
  updateZoom,
  zoom,
  offset,
}) => (
  <div
    ref={ref => ref && setEditorRef(ref)}
    onDrop={event => {
      const dataKey = event.dataTransfer.getData(DATA_TRANSFER_WIDGET_KEY)
      const command = schema.commands.find(c => c.key === dataKey)
      const pos = getRelativePoint({ x: event.clientX, y: event.clientY }, editorRef)
      addWidget(command, pos)
    }}
    className={classnames('editor')}
    onDragOver={event => event.preventDefault()}
    onMouseMove={e => onEditorMouseMove(getRelativePoint({ x: e.clientX, y: e.clientY }, editorRef))}
    onMouseDown={e => setDragging(true)}
    onMouseUp={e => setDragging(false)}
    onWheel={(e) => updateZoom(e, 0.001)}>
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
    setDragging,
    updateZoom,
  },
)(MainEditor)

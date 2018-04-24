import React from 'react'
import classnames from 'classnames'
import './_MainEditor.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { connect } from 'react-redux'
import { widgetsSelector, editorRefSelector, zoomSelector, offsetSelector, currentLinkSelector, linksSelector, relativeCursorPointSelector } from './state'
import {
  addWidget,
  setEditorRef,
  onEditorMouseMove,
  onEditorMouseDown,
  updateZoom,
  onEditorMouseUp,
} from './actions'
import Widget from './Widget'
import Link from './Link'

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
  currentLink,
  links,
  cursor,
}) => (
  <div
    ref={(ref) => ref && setEditorRef(ref)}
    onDrop={(event) => {
      const dataKey = event.dataTransfer.getData(DATA_TRANSFER_WIDGET_KEY)
      // sometimes called from widget with dragable = false
      if (!dataKey) return
      const command = schema.commands.find((c) => c.key === dataKey)
      addWidget(command, { x: event.clientX, y: event.clientY })
    }}
    className={classnames('editor')}
    onDragOver={(event) => event.preventDefault()}
    onMouseMove={(e) => onEditorMouseMove({ x: e.clientX, y: e.clientY })}
    onMouseDown={(e) => {
      e.stopPropagation()
      onEditorMouseDown({ x: e.clientX, y: e.clientY })
    }}
    onMouseUp={(e) => onEditorMouseUp()}
    onWheel={(e) => updateZoom(e.deltaY, 0.001)}
  >
    <svg
      className="Editor__Inner__Svg"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {
        Object.keys(links).map((key) => (
          <Link
            points={links[key].path}
            selected={links[key].selected}
            key={key}
            editorKey={key}
          />
        ))
      }
      {
        currentLink && <Link
          currentLink
          points={cursor ? [...currentLink.path, cursor] : currentLink.path}
          selected
        />
      }
    </svg>
    <div
      className={classnames('editor__inner')}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {
        Object.keys(widgets).map((key) => (
          <Widget {...widgets[key]} key={key} />
        ))
      }
    </div>
  </div >
)

export default connect(
  (state) => ({
    widgets: widgetsSelector(state),
    editorRef: editorRefSelector(state),
    zoom: zoomSelector(state),
    offset: offsetSelector(state),
    currentLink: currentLinkSelector(state),
    links: linksSelector(state),
    cursor: relativeCursorPointSelector(state),
  }),
  {
    addWidget,
    setEditorRef,
    onEditorMouseMove,
    onEditorMouseDown,
    onEditorMouseUp,
    updateZoom,
  }
)(MainEditor)

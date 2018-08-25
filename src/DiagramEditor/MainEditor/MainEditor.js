import React from 'react'
import classnames from 'classnames'
import './_MainEditor.scss'
import { connect } from 'react-redux'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { currentLinkSelector, linksSelector } from '../Links/selectors'
import {
  zoomSelector,
  editorRefSelector,
  offsetSelector,
  relativeCursorPointSelector,
} from './selectors'
import { widgetsSelector } from '../Widgets/selectors'
import {
  onWidgetDrop,
  onEditorMouseDown,
  onEditorMouseMove,
  onEditorMouseUp,
  setEditorRef,
  updateZoom,
} from './actions'
import WidgetEnhancer from '../Widgets/WidgetEnhancer'
import Link from '../Links/Link'
import { map } from 'lodash'

const MainEditor = ({
  schema,
  widgets,
  onWidgetDrop,
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
      onWidgetDrop(command, { x: event.clientX, y: event.clientY })
    }}
    className={classnames('editor')}
    onDragOver={(event) => event.preventDefault()}
    onMouseMove={(e) => onEditorMouseMove({ x: e.clientX, y: e.clientY })}
    onMouseDown={(e) => {
      e.stopPropagation()
      onEditorMouseDown({ x: e.clientX, y: e.clientY })
    }}
    onMouseUp={(e) => onEditorMouseUp()}
    onWheel={(e) => {
      e.preventDefault()
      e.stopPropagation()
      updateZoom(e.deltaY, 0.001)
    }}
  >
    <svg
      className="Editor__Inner__Svg"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {Object.keys(links).map((key) => (
        <Link points={links[key].path} selected={links[key].selected} key={key} editorKey={key} />
      ))}
      {currentLink && (
        <Link
          currentLink
          points={cursor ? [...currentLink.path, cursor] : currentLink.path}
          selected
        />
      )}
    </svg>
    <div
      className={classnames('editor__inner')}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {map(widgets, (widget) => <WidgetEnhancer key={widget.editorKey} widget={widget} />)}
    </div>
  </div>
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
    onWidgetDrop,
    setEditorRef,
    onEditorMouseMove,
    onEditorMouseDown,
    onEditorMouseUp,
    updateZoom,
  }
)(MainEditor)

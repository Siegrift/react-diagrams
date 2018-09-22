import React from 'react'
import classnames from 'classnames'
import { map, isEqual } from 'lodash'
import { connect } from 'react-redux'
import {
  zoomSelector,
  offsetSelector,
  relativeCursorPointSelector,
  editorBoundsSelector,
} from './selectors'
import { extractBoundingBox } from './mainEditorUtils'
import {
  onWidgetDrop,
  onEditorMouseDown,
  onEditorMouseMove,
  onEditorMouseUp,
  setEditorBounds,
  updateZoom,
} from './actions'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { currentLinkSelector, linksSelector } from '../links/selectors'
import { widgetsSelector } from '../widgets/selectors'
import { addPointToCurrentLink } from '../links/actions'
import WidgetEnhancer from '../widgets/WidgetEnhancer'
import Link from '../links/Link'
import { createDefaultLinkPoint } from '../linkPoints/linkPointUtils'
import './_MainEditor.scss'

const ZOOM_DELTA_MULTIPLIER = 0.00097

const MainEditor = ({
  schema,
  widgets,
  onWidgetDrop,
  setEditorBounds,
  onEditorMouseMove,
  onEditorMouseDown,
  onEditorMouseUp,
  updateZoom,
  zoom,
  offset,
  currentLink,
  links,
  cursor,
  bounds,
  addPointToCurrentLink,
}) => (
  <div
    ref={(ref) => {
      const boundingBox = ref ? extractBoundingBox(ref.getBoundingClientRect()) : null
      if (boundingBox && !isEqual(boundingBox, bounds)) {
        setEditorBounds(boundingBox)
      }
    }}
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
      // for some strange bug mouse event on current link is not fired reliably in the Link
      if (currentLink) addPointToCurrentLink({ x: e.clientX, y: e.clientY })
      else onEditorMouseDown({ x: e.clientX, y: e.clientY })
    }}
    onMouseUp={(e) => onEditorMouseUp()}
    onWheel={(e) => {
      e.preventDefault()
      e.stopPropagation()
      const bounds = e.currentTarget.getBoundingClientRect()
      updateZoom(
        {
          x: e.clientX - bounds.left - bounds.width / 2,
          y: e.clientY - bounds.top - bounds.height / 2,
        },
        e.deltaY * ZOOM_DELTA_MULTIPLIER
      )
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
          points={currentLink.path}
          selected
          cursor={createDefaultLinkPoint(cursor, false)}
        />
      )}
    </svg>
    <div
      className={classnames('editor__inner')}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      }}
    >
      {map(widgets, (widget) => (
        <WidgetEnhancer key={widget.editorKey} widget={widget} />
      ))}
    </div>
  </div>
)

export default connect(
  (state) => ({
    widgets: widgetsSelector(state),
    zoom: zoomSelector(state),
    offset: offsetSelector(state),
    currentLink: currentLinkSelector(state),
    links: linksSelector(state),
    cursor: relativeCursorPointSelector(state),
    bounds: editorBoundsSelector(state),
  }),
  {
    onWidgetDrop,
    setEditorBounds,
    onEditorMouseMove,
    onEditorMouseDown,
    onEditorMouseUp,
    updateZoom,
    addPointToCurrentLink,
  }
)(MainEditor)

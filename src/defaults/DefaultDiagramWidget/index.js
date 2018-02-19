import React from 'react'
import classnames from 'classnames'
import './_DefaultDiagramWidget.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'

const DefaultDiagramWidget = ({ className, x, y, children, color, widgetKey, sidePanel, ...other }) => (
  <div
    className={classnames('diagram-widget', className, { 'diagram-widget__side-panel': sidePanel })}
    style={{ top: y, left: x, backgroundColor: color }}
    draggable={sidePanel}
    onDragStart={event => {
      event.dataTransfer.setData(DATA_TRANSFER_WIDGET_KEY, widgetKey)
    }}
  >
    {children}
  </div>
)

export default DefaultDiagramWidget

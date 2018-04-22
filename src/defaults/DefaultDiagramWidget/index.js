import React from 'react'
import classnames from 'classnames'
import './_DefaultDiagramWidget.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'
import { map } from 'lodash'
import DefaultDiagramPort from '../DefaultDiagramPort'
import { onWidgetMouseDown } from '../../DiagramEditor/MainEditor/actions'
import { connect } from 'react-redux'

const DefaultDiagramWidget = ({ className, x, y, children, color, widgetKey, sidePanel,
  name, inPorts, outPorts, editorKey, selected, onWidgetMouseDown,
}) => (
  <div
    className={classnames(
      'diagram-widget',
      className,
      {
        'diagram-widget__side-panel': sidePanel,
        'diagram-widget__selected': selected,
      }
    )}
    style={{ top: y, left: x, backgroundColor: color }}
    draggable={sidePanel}
    onDragStart={(event) => {
      if (!sidePanel) return
      event.dataTransfer.setData(DATA_TRANSFER_WIDGET_KEY, widgetKey)
    }}
    onMouseDown={(e) => onWidgetMouseDown(editorKey, e)}
  >
    <p className="diagram-widget__name">{name}</p>
    <div className="ports">
      <div className="ports__in">{
        map(inPorts, (port) =>
          <DefaultDiagramPort {...port} isInPort />
        )
      }</div>
      <div className="ports__out">{
        map(outPorts, (port) =>
          <DefaultDiagramPort {...port} />
        )}</div>
    </div>
    {children}
  </div>
)

export default connect(
  null,
  { onWidgetMouseDown },
)(DefaultDiagramWidget)

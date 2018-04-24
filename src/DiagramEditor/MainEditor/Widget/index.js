import React from 'react'
import classnames from 'classnames'
import './_Widget.scss'
import { DATA_TRANSFER_WIDGET_KEY } from '../../../constants'
import { map } from 'lodash'
import Port from '../Port'
import { onWidgetMouseDown } from './actions'
import { connect } from 'react-redux'

const Widget = ({ className, x, y, children, color, widgetKey, sidePanel,
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
    onMouseDown={(e) => {
      if (sidePanel) return
      e.stopPropagation()
      onWidgetMouseDown(editorKey, e)
    }}
  >
    <p className="diagram-widget__name">{name}</p>
    <div className="ports">
      <div className="ports__in">{
        map(inPorts, (port) =>
          <Port {...port} isInPort sidePanel={sidePanel} />
        )
      }</div>
      <div className="ports__out">{
        map(outPorts, (port) =>
          <Port {...port} sidePanel={sidePanel} />
        )}</div>
    </div>
    {children}
  </div>
)

export default connect(
  null,
  { onWidgetMouseDown },
)(Widget)

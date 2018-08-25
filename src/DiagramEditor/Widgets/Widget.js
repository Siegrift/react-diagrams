import React from 'react'
import classnames from 'classnames'
import './_Widget.scss'
import { map } from 'lodash'
import Port from '../Ports/Port'

const Widget = ({
  className,
  x,
  y,
  children,
  color,
  name,
  inPorts,
  outPorts,
  editorKey,
  selected,
  onMouseDown,
  onDragStart,
  draggable,
}) => (
  <div
    id={editorKey}
    className={classnames('diagram-widget', className, {
      'diagram-widget__selected': selected,
    })}
    style={{ top: y, left: x, backgroundColor: color }}
    draggable={draggable}
    onDragStart={onDragStart}
    onMouseDown={onMouseDown}
  >
    <p className="diagram-widget__name">{name}</p>
    <div className="ports">
      <div className="ports__in">{map(inPorts, (port) => <Port {...port} isInPort />)}</div>
      <div className="ports__out">{map(outPorts, (port) => <Port {...port} />)}</div>
    </div>
    {children}
  </div>
)

export default Widget

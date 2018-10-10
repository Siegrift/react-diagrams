import React from 'react'
import classnames from 'classnames'
import { map } from 'lodash'
import Port from '../ports/Port'
import './_Widget.scss'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Measure from 'react-measure'
import { WIDGET_ICON_MODE_TRASHHOLD } from '../../constants'

import AddCircle from 'react-icons/lib/md/add-circle'

// TODO: We get a warning about variant not being recognized because of
// https://github.com/mui-org/material-ui/issues/13145
const WholeWidget = ({
  className,
  editorKey,
  draggable,
  color,
  selected,
  onDragStart,
  onMouseDown,
  y,
  x,
  inPorts,
  outPorts,
  name,
  isSidePanel,
}) => (
  <Card
    id={editorKey}
    className={classnames('diagram-widget', className, {
      'diagram-widget__selected': selected,
    })}
    style={{ top: y, left: x, backgroundColor: color }}
    draggable={draggable}
    onDragStart={onDragStart}
    onMouseDown={onMouseDown}
  >
    <CardContent style={{ padding: '10px' }}>
      <Typography variant="h5" component="h2" align="center" noWrap>
        <AddCircle size={30} />
        <span>{name}</span>
      </Typography>
      <div className="ports">
        <div className="ports__in">
          {map(inPorts, (port) => (
            <Port {...port} isInPort className={isSidePanel && 'DiagramPort__SidePanel'} />
          ))}
        </div>
        <div className="ports__out">
          {map(outPorts, (port) => (
            <Port {...port} className={isSidePanel && 'DiagramPort__SidePanel'} />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)

const IconWidget = (props) => (
  <div
    id={props.editorKey}
    className="diagram-widget__IconMode"
    style={{ top: props.y, left: props.x, backgroundColor: props.color }}
    draggable={props.draggable}
    onDragStart={props.onDragStart}
    onMouseDown={props.onMouseDown}
  >
    <AddCircle size={30} />
  </div>
)

const Widget = (props) =>
  props.isSidePanel ? (
    <Measure bounds>
      {({ measureRef, contentRect }) => (
        <div ref={measureRef}>
          {contentRect.bounds.width > WIDGET_ICON_MODE_TRASHHOLD ? (
            <WholeWidget {...props} />
          ) : (
            <IconWidget {...props} />
          )}
        </div>
      )}
    </Measure>
  ) : (
    <WholeWidget {...props} />
  )

export default Widget

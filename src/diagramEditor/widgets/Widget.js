import React from 'react'
import classnames from 'classnames'
import { map } from 'lodash'
import Port from '../ports/Port'
import './_Widget.scss'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Measure from 'react-measure'
import Tooltip from '@material-ui/core/Tooltip'
import { WIDGET_ICON_MODE_TRASHHOLD } from '../../constants'
import { withSchemaCommandContext } from '../SchemaContext'

// TODO: We get a warning about variant not being recognized because of
// https://github.com/mui-org/material-ui/issues/13145
const WholeWidget = ({
  className,
  editorKey,
  draggable,
  selected,
  onDragStart,
  onMouseDown,
  y,
  x,
  inPorts,
  outPorts,
  isSidePanel,
  command,
}) => (
  <Card
    id={editorKey}
    className={classnames('diagram-widget', className, {
      'diagram-widget__selected': selected,
    })}
    style={{ top: y, left: x, backgroundColor: command.color }}
    draggable={draggable}
    onDragStart={onDragStart}
    onMouseDown={onMouseDown}
  >
    <CardContent style={{ padding: '10px' }}>
      <Typography
        variant="h5"
        component="div"
        align="center"
        noWrap
        className="diagram-widget__Header"
      >
        <command.Icon size={30} className="diagram-widget__Header__Icon" />
        <span className="diagram-widget__Header__Title">{command.name}</span>
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
    className="IconWidget"
    style={{ top: props.y, left: props.x, backgroundColor: props.color }}
    draggable={props.draggable}
    onDragStart={props.onDragStart}
    onMouseDown={props.onMouseDown}
  >
    <props.command.Icon size={30} />
  </div>
)

const Widget = (props) =>
  props.isSidePanel ? (
    <Measure bounds>
      {({ measureRef, contentRect }) => (
        <Tooltip title={props.command.name} placement="right">
          <div ref={measureRef}>
            {contentRect.bounds.width > WIDGET_ICON_MODE_TRASHHOLD ? (
              <WholeWidget {...props} />
            ) : (
              <IconWidget {...props} />
            )}
          </div>
        </Tooltip>
      )}
    </Measure>
  ) : (
    <WholeWidget {...props} className="diagram-widget--constrained" />
  )

export default withSchemaCommandContext((props) => props.commandKey)(Widget)

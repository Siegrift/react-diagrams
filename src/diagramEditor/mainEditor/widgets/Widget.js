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
import { WIDGET_ICON_MODE_TRASHHOLD } from '../../../constants'
import { withSchemaCommandContext } from '../../SchemaContext'

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
  currentLinkSource,
}) => (
  <Card
    id={editorKey}
    className={classnames('DiagramWidget', className, {
      DiagramWidget__selected: selected,
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
        className="DiagramWidget__Header"
      >
        <command.Icon size={30} className="DiagramWidget__Header__Icon" />
        <span className="DiagramWidget__Header__Title">{command.name}</span>
      </Typography>
      <div className="DiagramWidget__Ports">
        <div>
          {map(inPorts, (port) => (
            <Port
              {...port}
              selected={currentLinkSource && currentLinkSource === port.editorKey}
              isInPort
              isSidePanel={isSidePanel}
            />
          ))}
        </div>
        <div>
          {map(outPorts, (port) => (
            <Port
              {...port}
              selected={currentLinkSource && currentLinkSource === port.editorKey}
              isSidePanel={isSidePanel}
            />
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
    <WholeWidget {...props} className="DiagramWidget__constrained" />
  )

export default withSchemaCommandContext((props) => props.commandKey)(Widget)

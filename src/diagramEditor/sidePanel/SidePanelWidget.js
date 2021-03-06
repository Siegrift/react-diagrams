import React from 'react'
import Widget from '../mainEditor/widgets/Widget'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'

const SidePanelWidget = ({ className, draggable, command }) => (
  <Widget
    {...command}
    commandKey={command.key}
    className={className}
    draggable={draggable}
    onDragStart={(event) => {
      event.dataTransfer.setData(DATA_TRANSFER_WIDGET_KEY, command.key)
    }}
    isSidePanel
  />
)

export default SidePanelWidget

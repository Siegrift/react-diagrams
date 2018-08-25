import React from 'react'
import Widget from '../Widgets/Widget'
import { DATA_TRANSFER_WIDGET_KEY } from '../../constants'

const SidePanelWidget = ({ className, draggable, command }) => (
  <Widget
    {...command}
    className={className}
    draggable={draggable}
    onDragStart={(event) => {
      event.dataTransfer.setData(DATA_TRANSFER_WIDGET_KEY, command.key)
    }}
  />
)

export default SidePanelWidget

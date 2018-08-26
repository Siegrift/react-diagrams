import React from 'react'
import SidePanelWidget from './SidePanelWidget'

const SidePanel = ({ schema }) => (
  <div>
    {schema.commands.map((command) => (
      <SidePanelWidget
        className="diagram-widget__side-panel"
        draggable
        key={command.key}
        command={command}
      />
    ))}
  </div>
)

export default SidePanel

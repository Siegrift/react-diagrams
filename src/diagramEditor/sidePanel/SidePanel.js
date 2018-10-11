import React from 'react'
import SidePanelWidget from './SidePanelWidget'
import { withSchemaContext } from '../SchemaContext'

const SidePanel = ({ schema }) => (
  <div>
    {schema.commands.map((command) => (
      <SidePanelWidget
        className="DiagramWidget__SidePanel"
        draggable
        key={command.key}
        command={command}
      />
    ))}
  </div>
)

export default withSchemaContext(SidePanel)

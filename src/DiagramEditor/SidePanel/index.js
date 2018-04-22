import React from 'react'
import DefaultDiagramWidget from '../../defaults/DefaultDiagramWidget'

const SidePanel = ({ schema }) => (
  <div>
    {
      schema.commands.map((c) => (
        <DefaultDiagramWidget key={c.key} {...c} widgetKey={c.key} sidePanel />
      ))
    }
  </div>
)

export default SidePanel

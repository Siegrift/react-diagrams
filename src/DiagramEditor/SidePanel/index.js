import React from 'react'
import DefaultDiagramWidget from '../../defaults/DefaultDiagramWidget'

const SidePanel = ({ schema }) => (
  <div>
    {
      schema.commands.map((c) => (
        // 'key' is hidden by react
        <DefaultDiagramWidget {...c} widgetKey={c.key} sidePanel />
      ))
    }
  </div>
)

export default SidePanel

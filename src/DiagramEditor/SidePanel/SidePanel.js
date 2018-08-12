import React from 'react'
import Widget from '../MainEditor/Widget/Widget'

const SidePanel = ({ schema }) => (
  <div>{schema.commands.map((c) => <Widget key={c.key} {...c} widgetKey={c.key} sidePanel />)}</div>
)

export default SidePanel

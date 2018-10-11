// @flow
import React from 'react'
import type { Schema, Command } from '../flow/schemaTypes'

// create context with empty schema
export const SchemaContext = React.createContext({})

export const withSchemaContext = (Component: React.Node) => {
  return (props: object) => (
    <SchemaContext.Consumer>
      {(schema: Schema) => <Component {...props} schema={schema} />}
    </SchemaContext.Consumer>
  )
}

export const withSchemaCommandContext = (getCommandKey: (props: object) => string) => (
  Component: React.Node
) => (props: object) => (
  <SchemaContext.Consumer>
    {(schema: Schema) => (
      <Component
        {...props}
        command={schema.commands.find((command: Command) => command.key === getCommandKey(props))}
      />
    )}
  </SchemaContext.Consumer>
)

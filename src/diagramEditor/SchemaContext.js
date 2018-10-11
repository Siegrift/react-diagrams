// @flow
import * as React from 'react'
import type { Schema, Command } from '../flow/schemaTypes'

// create context with empty schema
export const SchemaContext = React.createContext({ commands: [], types: [] })

export const withSchemaContext = (Component: React.ComponentType<{ schema: Schema }>) => {
  return (props: Object) => (
    <SchemaContext.Consumer>
      {(schema: Schema) => <Component {...props} schema={schema} />}
    </SchemaContext.Consumer>
  )
}

export const withSchemaCommandContext = (getCommandKey: (props: Object) => string) => (
  Component: React.ComponentType<{ schema: Schema }>
) => (props: Object) => (
  <SchemaContext.Consumer>
    {(schema: Schema) => (
      <Component
        {...props}
        command={schema.commands.find((command: Command) => command.key === getCommandKey(props))}
      />
    )}
  </SchemaContext.Consumer>
)

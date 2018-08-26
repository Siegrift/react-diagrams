// @flow
export type Port = {
  key: string,
  name: string,
  type: string
};
export type Command = {
  name: string,
  key: string,
  desc: string,
  inPorts: Port[],
  outPorts: Port[],
  color: string
};
export type Schema = {
  types: string[],
  commands: Command[]
};

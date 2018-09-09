// @flow
export const keyboardEventToString = (event: KeyboardEvent) => {
  const mods = []
  if (event.ctrlKey) mods.push('Ctrl')
  if (event.shiftKey) mods.push('Shift')
  if (event.altKey) mods.push('Alt')
  mods.push(event.code)
  return mods.join('+')
}

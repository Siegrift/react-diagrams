export const PATH_WIDGETS = ['widgets']
export const getWidgetPathByEditorKey = (editorKey) => [...PATH_WIDGETS, editorKey]

export const setInitialState = (state) => ({
  ...state,
  [PATH_WIDGETS]: {},
})

export const PATH_LINKS = ['links']
export const PATH_CURRENT_LINK = [...PATH_LINKS, 'currentLink']
export const PATH_CURRENT_LINK_POINTS = [...PATH_CURRENT_LINK, 'path']
export const getLinkPathByEditorKey = (editorKey) => [...PATH_LINKS, editorKey]

export const setInitialState = (state) => ({
  ...state,
  [PATH_LINKS]: {},
  [PATH_CURRENT_LINK]: undefined,
})

import { setIn, getIn } from '../../utils/helpers'

export const PATH_EDITOR = ['editor']

export const setInitialState = (state) =>
  setIn(state, PATH_EDITOR, {
    mouse: undefined,
    widgets: {},
    editorRef: undefined,
  }, true)

export const widgetsSelector = (state) => getIn(state, [...PATH_EDITOR, 'widgets'])
export const editorRefSelector = (state) => getIn(state, [...PATH_EDITOR, 'editorRef'])

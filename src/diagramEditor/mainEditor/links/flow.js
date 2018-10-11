// @flow
import type { EditorKey, Node } from '../../../flow/commonTypes'

export type Link = Node & {
  source: EditorKey,
  target: EditorKey,
  path: EditorKey[],
}

export type LinkState = { [key: EditorKey]: Link }
export type CurrentLink = {
  source: EditorKey,
  target?: EditorKey,
  path: EditorKey[],
}

// NOTE: Type needs to be manually updated when PATH changes
export type AppliedLinkState = { links: LinkState, currrentLink: CurrentLink }

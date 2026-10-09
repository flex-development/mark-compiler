import type { Root } from '@flex-development/mark/ast'
import type {} from '@flex-development/mark/ast/compile'
import type unist from 'unist'

declare module '@flex-development/mark/ast' {
  interface Extension {
    canContainEols?: string[] | null | undefined
  }

  interface NodeMap {
    literal: unist.Literal
    node: unist.Node
    parent: unist.Parent
    root: Root
  }
}

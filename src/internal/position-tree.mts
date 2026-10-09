/**
 * @file Internal - positionTree
 * @module mark-compiler/internal/positionTree
 */

import type { Tree } from '@flex-development/mark/ast'
import type { Position, Token } from '@flex-development/mark/parse'
import point from './point.mts'

/**
 * Position a `tree` based on `events`.
 *
 * > 👉 **Note**: Does nothing if the event list is empty.
 *
 * @internal
 *
 * @this {void}
 *
 * @param {Tree} tree
 *  The tree to position
 * @param {[unknown, Token, unknown?][]} events
 *  The list of events
 * @return {undefined}
 */
function positionTree(
  this: void,
  tree: Tree,
  events: [unknown, Token, unknown?][]
): undefined {
  if (events.length) {
    tree.position ??= {} as Position
    tree.position.start = point(events[0]![1].start)
    tree.position.end = point(events[events.length - 1]![1].end)
  }

  return void tree
}

export default positionTree

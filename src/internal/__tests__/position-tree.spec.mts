/**
 * @file Unit Tests - positionTree
 * @module mark-compiler/internal/tests/unit/positionTree
 */

import tokens from '#fixtures/tokens'
import testSubject from '#internal/position-tree'
import { ev } from '@flex-development/mark-util-symbol'
import type { Tree } from '@flex-development/mark/ast'
import type { Token } from '@flex-development/mark/parse'
import { u } from '@flex-development/unist-util-builder'
import type { Position } from 'unist'
import { beforeAll, describe, expect, it } from 'vitest'

describe('unit:internal/positionTree', () => {
  let events: [[typeof ev.enter, Token], [typeof ev.exit, Token]]
  let token: Token

  beforeAll(() => {
    token = tokens.succ
    events = [[ev.enter, token], [ev.exit, token]]
  })

  it('should do nothing if `events` is empty', () => {
    // Arrange
    const tree: Tree = u('root', [])

    // Act
    testSubject(tree, [])

    // Expect
    expect(tree).not.to.have.property('position')
  })

  it.each<[Tree]>([
    [u('root', [])],
    [u('root', { children: [], position: {} })]
  ])('should position `tree` based on `events` (%#)', tree => {
    // Arrange
    const position: Position | undefined = tree.position

    // Act
    testSubject(tree, events)

    // Expect (conditional)
    if (position) {
      expect(tree).to.have.property('position', position)
    } else {
      expect(tree).to.have.property('position').not.eq(position)
    }

    // Expect
    expect(tree).to.have.nested.property('position.end')
    expect(tree).to.have.nested.property('position.start')
    expect(tree.position!.end).not.to.eq(token.end)
    expect(tree.position!.start).not.to.eq(token.start)
  })
})

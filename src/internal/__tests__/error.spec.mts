/**
 * @file Unit Tests - error
 * @module mark-compiler/internal/tests/unit/error
 */

import boom from '#fixtures/boom'
import tokens from '#fixtures/tokens'
import testSubject from '#internal/error'
import thrower from '#tests/utils/thrower'
import type {
  CompileContext,
  OnEnterError,
  OnExitError
} from '@flex-development/mark/ast'
import type { Token } from '@flex-development/mark/parse'
import { pick } from '@flex-development/tutils'
import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock
} from 'vitest'

describe('unit:internal/error', () => {
  type Args = Parameters<typeof testSubject>

  let context: CompileContext
  let onEnterError: Mock<OnEnterError>
  let onExitError: Mock<OnExitError>

  beforeAll(() => {
    context = {} as CompileContext
  })

  beforeEach(() => {
    onEnterError = vi.fn().mockName('onEnterError').mockImplementation(thrower)
    onExitError = vi.fn().mockName('onExitError').mockImplementation(thrower)
  })

  it.each<[left: Token | undefined, right: Token]>([
    [undefined, tokens.eoc],
    [tokens.succ, tokens.fail]
  ])('should call `onEnterError` (%#)', (left, right) => {
    // Arrange
    const args: Args = [left, right, onEnterError]

    // Act + Expect
    expect(() => testSubject.call(context, ...args)).to.throw(boom)
    expect(onEnterError).toHaveBeenCalledExactlyOnceWith(left, right)
    expect(onEnterError.mock.contexts[0]).to.eq(context)
  })

  it.each<[left: Token, right: Token]>([
    [tokens.succ, tokens.succ]
  ])('should call `onExitError` (%#)', (left, right) => {
    // Arrange
    const args: Args = [left, right, onEnterError, onExitError]

    // Act + Expect
    expect(() => testSubject.call(context, ...args)).to.throw(boom)
    expect(onEnterError).not.toHaveBeenCalled()
    expect(onExitError).toHaveBeenCalledExactlyOnceWith(left, right)
    expect(onExitError.mock.contexts[0]).to.eq(context)
  })

  it.each<[left: Token | undefined, right: Token]>([
    [undefined, tokens.eoc],
    [tokens.fail, tokens.succ]
  ])('should throw error (%#)', (left, right) => {
    // Arrange
    let error!: Error

    // Act
    try {
      testSubject.call(context, left, right)
    } catch (e: unknown) {
      error = e as typeof error
    }

    // Expect
    expect(error).to.be.instanceof(Error)
    expect(error).to.have.property('cause')
    expect(error.cause).to.have.property('close', left)
    expect(error.cause).to.have.property('open', right)
    expect(pick(error, ['cause', 'message'])).toMatchSnapshot()
  })
})

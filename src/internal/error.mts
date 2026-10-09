/**
 * @file Internal - error
 * @module mark-compiler/internal/error
 */

import { chars } from '@flex-development/mark-util-symbol'
import type {
  CompileContext,
  OnEnterError,
  OnExitError
} from '@flex-development/mark/ast'
import type { Token } from '@flex-development/mark/parse'
import {
  stringifyPosition
} from '@flex-development/unist-util-stringify-position'

/**
 * Handle the case where the `right` token is open,
 * but is closed by the `left` token, by exiting the `left` token,
 * or because end of content was reached.
 *
 * @internal
 *
 * @this {CompileContext}
 *
 * @param {Token | null | undefined} left
 *  The exiting token
 * @param {Token} right
 *  The open token
 * @param {OnEnterError | null | undefined} [onEnterError]
 *  Handle the case where another token is open, but closed by something else
 * @param {OnExitError | null | undefined} [onExitError]
 *  Handle the case where another token is open
 * @return {undefined}
 * @throws {Error}
 */
function error(
  this: CompileContext,
  left: Token | undefined,
  right: Token,
  onEnterError?: OnEnterError | null | undefined,
  onExitError?: OnExitError | null | undefined
): undefined {
  /**
   * The stringified position of the open token.
   *
   * @const {string} openPosition
   */
  const openPosition: string = stringifyPosition([right.start, right.end])

  /**
   * The reason for the error.
   *
   * @var {string} reason
   */
  let reason: string = 'Cannot close'

  if (left) {
    if (onExitError) return void onExitError.call(this, left, right)
    if (onEnterError) return void onEnterError.call(this, left, right)

    reason += chars.space + chars.graveAccent + left.type + chars.graveAccent
    reason += chars.space + chars.leftParen
    reason += stringifyPosition([left.start, left.end])
    reason += chars.rightParen + chars.semicolon + chars.space
    reason += 'a different token' + chars.space + chars.leftParen
    reason += chars.graveAccent + right.type + chars.graveAccent + chars.comma
    reason += chars.space + openPosition + chars.rightParen + chars.space
    reason += 'is open'
  } else {
    if (onEnterError) return void onEnterError.call(this, left, right)

    reason += chars.comma + chars.space + 'a token'
    reason += chars.space + chars.leftParen
    reason += chars.graveAccent + right.type + chars.graveAccent + chars.comma
    reason += chars.space + openPosition + chars.rightParen + chars.space
    reason += 'is still open'
  }

  throw new Error(reason, { cause: { close: left, open: right } })
}

export default error

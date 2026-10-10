/**
 * @file Type Aliases - FinalizeContext
 * @module mark-compiler/types/FinalizeContext
 */

import type { Options } from '@flex-development/mark-compiler'
import type { Context } from '@flex-development/mark/ast'

/**
 * Finalize the compilation context.
 *
 * @see {@linkcode Context}
 * @see {@linkcode Options}
 *
 * @this {void}
 *
 * @param {Context} context
 *  The current compilation context
 * @param {Options} options
 *  The options used to create the compiler
 * @return {null | undefined}
 */
type FinalizeContext = (
  this: void,
  context: Context,
  options: Options
) => null | undefined

export type { FinalizeContext as default }

/**
 * @file Type Aliases - Extensions
 * @module mark-compiler/types/Extensions
 */

import type { CreateExtensions, Extension } from '@flex-development/mark/ast'
import type { List } from '@flex-development/mark/core'

/**
 * An extension, a list of extensions, or a factory function.
 *
 * @see {@linkcode CreateExtensions}
 * @see {@linkcode Extension}
 * @see {@linkcode List}
 */
type Extensions =
  | CreateExtensions
  | Extension
  | List<Extension | List<Extension>>

export type { Extensions as default }

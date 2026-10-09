/**
 * @file Internal - point
 * @module mark-compiler/internal/point
 */

import type { Point } from '@flex-development/mark/parse'

/**
 * Copy a point-like value.
 *
 * @internal
 *
 * @param {Point | null | undefined} point
 *  The point to copy
 * @return {Point}
 *  The new point
 */
function point(point: Point | null | undefined): Point {
  point ??= { column: 1, line: 1, offset: 0 }
  return { column: point.column, line: point.line, offset: point.offset }
}

export default point

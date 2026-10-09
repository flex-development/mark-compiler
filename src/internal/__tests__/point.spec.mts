/**
 * @file Unit Tests - point
 * @module mark-compiler/internal/tests/unit/point
 */

import testSubject from '#internal/point'
import { describe, expect, it } from 'vitest'

describe('unit:internal/point', () => {
  it.each<Parameters<typeof testSubject>>([
    [null],
    [{ column: 3, line: 13, offset: 2 }]
  ])('should return new point (%j)', point => {
    // Act
    const result = testSubject(point)

    // Expect
    expect(result).to.not.eq(point)
    expect(result).toMatchSnapshot()
  })
})

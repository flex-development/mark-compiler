/**
 * @file Unit Tests - isList
 * @module mark-compiler/internal/tests/unit/isList
 */

import testSubject from '#internal/is-list'
import { describe, expect, it } from 'vitest'

describe('unit:internal/isList', () => {
  it.each<Parameters<typeof testSubject>>([
    [import.meta.url],
    [new Map()],
    [new WeakSet()]
  ])('should return `false` if `value` is not an array or Set (%#)', value => {
    expect(testSubject(value)).to.be.false
  })

  it('should return `true` if `value` is an array', () => {
    expect(testSubject([])).to.be.true
  })

  it('should return `true` if `value` is a Set', () => {
    expect(testSubject(new Set())).to.be.true
  })
})

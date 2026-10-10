/**
 * @file Type Tests - Extensions
 * @module mark-compiler/types/tests/unit-d/Extensions
 */

import type { CreateExtensions, Extension } from '@flex-development/mark/ast'
import type { List } from '@flex-development/mark/core'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../extensions.mts'

describe('unit-d:types/Extensions', () => {
  it('should allow CreateExtensions', () => {
    expectTypeOf<TestSubject>().extract<CreateExtensions>().not.toBeNever()
  })

  it('should allow Extension', () => {
    expectTypeOf<TestSubject>().extract<Extension>().not.toBeNever()
  })

  it('should allow List<Extension | List<Extension>>', () => {
    expectTypeOf<TestSubject>()
      .extract<List<Extension | List<Extension>>>()
      .not.toBeNever()
  })
})

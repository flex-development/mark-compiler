/**
 * @file Type Tests - FinalizeContext
 * @module mark-compiler/types/tests/unit-d/FinalizeContext
 */

import type { Options } from '@flex-development/mark-compiler'
import type { Context } from '@flex-development/mark/ast'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../finalize-context.mts'

describe('unit-d:types/FinalizeContext', () => {
  it('should match [this: void]', () => {
    expectTypeOf<TestSubject>().thisParameter.toEqualTypeOf<void>()
  })

  describe('parameters', () => {
    it('should be callable with [Context, Options]', () => {
      expectTypeOf<TestSubject>()
        .parameters
        .toEqualTypeOf<[Context, Options]>()
    })
  })

  describe('returns', () => {
    it('should return null | undefined', () => {
      expectTypeOf<TestSubject>().returns.toEqualTypeOf<null | undefined>()
    })
  })
})

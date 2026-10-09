/**
 * @file Type Tests - Options
 * @module mark-compiler/interfaces/tests/unit-d/Options
 */

import type {
  Extensions,
  FinalizeContext
} from '@flex-development/mark-compiler'
import type {
  Preprocess,
  SerializeNode,
  TakeExtension
} from '@flex-development/mark/ast'
import type { Point } from '@flex-development/mark/parse'
import type { Nilable } from '@flex-development/tutils'
import { describe, expectTypeOf, it } from 'vitest'
import type TestSubject from '../options.mts'

describe('unit-d:interfaces/Options', () => {
  it('should match [extensions?: Extensions | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('extensions')
      .toEqualTypeOf<Nilable<Extensions>>()
  })

  it('should match [finalizeContext?: FinalizeContext | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('finalizeContext')
      .toEqualTypeOf<Nilable<FinalizeContext>>()
  })

  it('should match [from?: Point | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('from')
      .toEqualTypeOf<Nilable<Point>>()
  })

  it('should match [preprocess?: Preprocess | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('preprocess')
      .toEqualTypeOf<Nilable<Preprocess>>()
  })

  it('should match [serializeNode?: SerializeNode | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('serializeNode')
      .toEqualTypeOf<Nilable<SerializeNode>>()
  })

  it('should match [takeExtension?: TakeExtension | null | undefined]', () => {
    expectTypeOf<TestSubject>()
      .toHaveProperty('takeExtension')
      .toEqualTypeOf<Nilable<TakeExtension>>()
  })
})

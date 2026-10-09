/**
 * @file E2E Tests - api
 * @module mark-compiler/tests/e2e/api
 */

import * as testSubject from '@flex-development/mark-compiler'
import { describe, expect, it } from 'vitest'

describe('e2e:mark-compiler', () => {
  it('should expose public api', () => {
    expect(Object.keys(testSubject)).toMatchSnapshot()
  })
})

/**
 * @file Fixtures - tokens
 * @module fixtures/tokens
 */

import tt from '#fixtures/tt'
import type { Token } from '@flex-development/mark/parse'

/**
 * Record, where each key is a token type and each value is a token fixture.
 *
 * @const {Record<tt.eoc | tt.fail | tt.succ, Token>} tokens
 */
const tokens: Record<tt.eoc | tt.fail | tt.succ, Token> = {
  [tt.eoc]: {
    end: { _bufferIndex: -1, _index: 2, column: 3, line: 1, offset: 2 },
    start: { _bufferIndex: -1, _index: 1, column: 3, line: 1, offset: 2 },
    type: tt.eoc
  },
  [tt.fail]: {
    end: { _bufferIndex: -1, _index: 1, column: 12, line: 1, offset: 11 },
    start: { _bufferIndex: 0, _index: 0, column: 1, line: 1, offset: 0 },
    type: tt.fail
  },
  [tt.succ]: {
    end: { _bufferIndex: 10, _index: 0, column: 11, line: 1, offset: 10 },
    start: { _bufferIndex: 1, _index: 0, column: 2, line: 1, offset: 1 },
    type: tt.succ
  }
}

export default tokens

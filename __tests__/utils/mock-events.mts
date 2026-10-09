/**
 * @file Test Utilities - mockEvents
 * @module tests/utils/mockEvents
 */

import tt from '#fixtures/tt'
import { ev } from '@flex-development/mark-util-symbol'
import type { Event, TokenizeContext } from '@flex-development/mark/parse'

export default mockEvents

/**
 * Get a list of mock events.
 *
 * @this {void}
 *
 * @param {TokenizeContext} context
 *  The tokenization context
 * @return {Event[]}
 *  The list of events
 */
function mockEvents(this: void, context: TokenizeContext): Event[] {
  return [
    [
      ev.enter,
      {
        end: { _bufferIndex: -1, _index: 1, column: 5, line: 1, offset: 4 },
        start: { _bufferIndex: 0, _index: 0, column: 1, line: 1, offset: 0 },
        type: tt.bracketExpression
      }
    ],
    [
      ev.enter,
      {
        end: { _bufferIndex: 3, _index: 0, column: 4, line: 1, offset: 3 },
        start: { _bufferIndex: 1, _index: 0, column: 2, line: 1, offset: 1 },
        type: tt.literal,
        value: 'ab'
      }
    ],
    [
      ev.exit,
      {
        end: { _bufferIndex: 3, _index: 0, column: 4, line: 1, offset: 3 },
        start: { _bufferIndex: 1, _index: 0, column: 2, line: 1, offset: 1 },
        type: tt.literal,
        value: 'ab'
      }
    ],
    [
      ev.exit,
      {
        end: { _bufferIndex: -1, _index: 1, column: 5, line: 1, offset: 4 },
        start: { _bufferIndex: 0, _index: 0, column: 1, line: 1, offset: 0 },
        type: tt.bracketExpression
      }
    ],
    [
      ev.enter,
      {
        end: { _bufferIndex: -1, _index: 2, column: 5, line: 1, offset: 4 },
        start: { _bufferIndex: -1, _index: 1, column: 5, line: 1, offset: 4 },
        type: tt.eoc
      }
    ],
    [
      ev.exit,
      {
        end: { _bufferIndex: -1, _index: 2, column: 5, line: 1, offset: 4 },
        start: { _bufferIndex: -1, _index: 1, column: 5, line: 1, offset: 4 },
        type: tt.eoc
      }
    ]
  ].map(([event, token]) => [event as Event[0], token as Event[1], context])
}

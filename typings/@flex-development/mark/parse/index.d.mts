import type { TokenizeContext } from '@flex-development/mark/parse'

declare module '@flex-development/mark/parse' {
  interface ContextMap {
    tokenize: TokenizeContext
  }

  interface TokenFields {
    value?: string | null | undefined
  }

  interface TokenTypeMap {
    bracketExpression: 'bracketExpression'
    literal: 'literal'
    eoc: 'eoc'
    fail: 'fail'
    succ: 'succ'
  }
}

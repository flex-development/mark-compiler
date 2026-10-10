/**
 * @file Unit Tests - createCompiler
 * @module mark-compiler/tests/unit/createCompiler
 */
import boom from '#fixtures/boom'
import tokens from '#fixtures/tokens'
import tt from '#fixtures/tt'
import error from '#internal/error'
import positionTree from '#internal/position-tree'
import mockEvents from '#tests/utils/mock-events'
import thrower from '#tests/utils/thrower'
import type {
  FinalizeContext,
  Options
} from '@flex-development/mark-compiler'
import { chars } from '@flex-development/mark-util-symbol'
import type {
  Buffer,
  Closer,
  CompileContext,
  CreateNode,
  Extension,
  Node,
  OnEnterError,
  OnExitError,
  Opener,
  Preprocess,
  SerializeNode,
  TakeExtension,
  Transform,
  Tree
} from '@flex-development/mark/ast'
import type { List } from '@flex-development/mark/core'
import type {
  SliceSerialize,
  Token,
  TokenizeContext
} from '@flex-development/mark/parse'
import { pick } from '@flex-development/tutils'
import { u } from '@flex-development/unist-util-builder'
import type { Parent } from 'unist'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock
} from 'vitest'
import testSubject from '../create-compiler.mts'

vi.mock('#internal/error', async og => {
  const module: { default: typeof error } = await og()
  return { default: vi.fn(module.default).mockName('error') }
})

vi.mock('#internal/position-tree', async og => {
  const module: { default: typeof error } = await og()
  return { default: vi.fn(module.default).mockName('positionTree') }
})

describe('unit:createCompiler', () => {
  let onEnterError: Mock<OnEnterError>
  let finalizeContext: Mock<FinalizeContext>
  let node: Node
  let parent: Parent
  let serializeNode: Mock<SerializeNode>
  let takeExtension: Mock<TakeExtension>

  afterEach(() => {
    delete node.position
  })

  beforeEach(() => {
    node = u(tt.succ)
    parent = u('parent', [])
    onEnterError = vi.fn().mockName('onEnterError').mockImplementation(thrower)
  })

  beforeEach(() => {
    finalizeContext = vi.fn().mockName('finalizeContext')
    serializeNode = vi.fn(() => null).mockName('serializeNode')
    takeExtension = vi.fn().mockName('takeExtension')
  })

  it('should create compile context', () => {
    expect(testSubject()).toMatchSnapshot()
  })

  it('should finalize compile context before merging extensions', () => {
    // Arrange
    const field: keyof Extension = 'canContainEols'
    const extension: Extension = { [field]: [] }
    const extensions: [Extension] = [extension]
    const options: Options = { extensions, finalizeContext, takeExtension }

    // Act
    const result = testSubject(options)

    // Expect
    expect(finalizeContext).toHaveBeenCalledOnce()
    expect(finalizeContext).toHaveBeenCalledWith(result, options)
    expect(finalizeContext).toHaveBeenCalledExactlyOnceWith(result, options)
    expect(finalizeContext).toHaveBeenCalledBefore(takeExtension)
    expect(takeExtension).toHaveBeenCalledOnce()
    expect(takeExtension).toHaveBeenCalledWith(result.config, extension, field)
  })

  it.each<[extensions: Extension | List<Extension>]>([
    [
      {
        enter: null,
        exit: null,
        transforms: null
      }
    ],
    [
      [
        {
          enter: { [tt.succ]: vi.fn().mockName('succEnter') },
          exit: { [tt.succ]: vi.fn().mockName('succExit') }
        },
        Object.create({
          enter: { [tt.fail]: vi.fn().mockName('failEnter') },
          exit: { [tt.fail]: vi.fn().mockName('failExit') }
        }),
        {
          enter: { [tt.eoc]: vi.fn().mockName('eocEnter') },
          exit: { [tt.eoc]: vi.fn().mockName('eocExit') },
          transforms: new Set([vi.fn().mockName('transform')])
        }
      ]
    ]
  ])('should merge extensions into `config` (%#)', extensions => {
    expect(testSubject({ extensions }).config).toMatchSnapshot()
  })

  describe('#buffer', () => {
    it('should push fragment onto `stack`', () => {
      // Arrange
      const subject: CompileContext = testSubject()

      // Act
      subject.buffer()

      // Expect
      expect(subject.stack).to.have.length(1)
      expect(subject.stack).to.have.nested.property('0.type', 'fragment')
      expect(subject.stack).to.have.nested.property('0.children').eql([])
    })
  })

  describe('#compile', () => {
    it('should push tree onto `stack`', () => {
      // Arrange
      const subject: CompileContext = testSubject()

      // Act
      subject.compile()

      // Expect
      expect(subject.stack).to.have.length(1)
      expect(subject.stack).to.have.nested.property('0.type', 'root')
    })

    describe('failure', () => {
      it('should error if tokens are still open', () => {
        // Arrange
        const subject: CompileContext = testSubject()

        // Setup
        subject.stack.push(parent)
        subject.enter(node, tokens.fail, onEnterError)

        // Act + Expect
        expect(subject.compile).to.throw(boom)
        expect(error).toHaveBeenCalledOnce()
        expect(error).toHaveBeenCalledWith(undefined, tokens.fail, onEnterError)
        expect(vi.mocked(error).mock.contexts[0]).to.eq(subject)
      })
    })

    describe('success', () => {
      let bracketExpression: Mock<CreateNode>
      let preprocess: Mock<Preprocess>
      let sliceSerialize: Mock<SliceSerialize>
      let subject: CompileContext
      let text: Mock<CreateNode>
      let tokenizer: TokenizeContext
      let transform1: Mock<Transform>
      let transform2: Mock<Transform>
      let transform3: Mock<Transform>
      let tree: Tree

      beforeAll(() => {
        tokenizer = {} as unknown as TokenizeContext
        tokenizer.events = mockEvents(tokenizer)

        subject = testSubject({
          /**
           * @this {void}
           *
           * @param {Opener} opener
           *  Create an enter handle
           * @param {Closer} closer
           *  Create an exit handle
           * @param {Buffer} buffer
           *  Capture some of the output data
           * @return {[Extension, [Extension]]}
           *  The extension
           */
          extensions(
            this: void,
            opener: Opener,
            closer: Closer,
            buffer: Buffer
          ): [Extension, [Extension]] {
            expect(buffer).to.be.a('function').with.property('name', 'buffer')
            expect(closer).to.be.a('function').with.property('name', 'closer')
            expect(opener).to.be.a('function').with.property('name', 'opener')

            bracketExpression = vi.fn(token => u(token.type, []))
            bracketExpression = bracketExpression.mockName('bracketExpression')

            text = vi.fn(token => u('text', { value: token.value }))
            text = text.mockName('text')

            transform1 = vi.fn().mockName('transform1')
            transform2 = vi.fn().mockName('transform2')
            transform3 = vi.fn().mockName('transform3')

            return [
              {
                enter: {
                  [tt.bracketExpression]: opener(bracketExpression),
                  [tt.literal]: opener(text)
                },
                exit: {
                  [tt.bracketExpression]: closer(),
                  [tt.literal]: closer()
                }
              },
              [
                {
                  transforms: [transform1, transform2, transform3]
                }
              ]
            ]
          },

          /**
           * Finalize the compilation context.
           *
           * @this {void}
           *
           * @param {CompileContext} context
           *  The current compile context
           * @return {undefined}
           */
          finalizeContext(this: void, context: CompileContext): undefined {
            preprocess = vi.fn().mockName('preprocess')
            sliceSerialize = vi.fn(() => chars.empty).mockName('sliceSerialize')

            context.preprocess = preprocess
            context.sliceSerialize = sliceSerialize

            return void context
          }
        })
      })

      beforeEach(() => {
        subject.compile(tokenizer.events)
        tree = subject.stack[0] as Tree
      })

      it('should apply tree transforms in order', () => {
        expect(transform1).toHaveBeenCalledWith(tree)
        expect(transform2).toHaveBeenCalledWith(tree)
        expect(transform3).toHaveBeenCalledWith(tree)
        expect(transform1).toHaveBeenCalledAfter(vi.mocked(positionTree))
        expect(transform2).toHaveBeenCalledAfter(vi.mocked(transform1))
        expect(transform3).toHaveBeenCalledAfter(vi.mocked(transform2))
      })

      it('should position tree based on `events`', () => {
        expect(positionTree).toHaveBeenCalledOnce()
        expect(positionTree).toHaveBeenCalledWith(tree, tokenizer.events)
      })

      it('should preprocess `events` before compilation', () => {
        expect(preprocess).toHaveBeenCalledOnce()
        expect(preprocess).toHaveBeenCalledWith(tokenizer.events, tree)
        expect(preprocess.mock.contexts[0]).eq(subject)
        expect(preprocess).toHaveBeenCalledBefore(bracketExpression)
        expect(preprocess).toHaveBeenCalledBefore(text)
      })
    })
  })

  describe('#enter', () => {
    let subject: CompileContext

    beforeEach(() => {
      subject = testSubject()
      subject.stack.push(parent)
      subject.enter(node, tokens.succ, onEnterError)
    })

    it('should add `node` to last parent', () => {
      expect(parent.children).to.have.length(1)
      expect(parent.children).to.have.property('0', node)
    })

    it('should begin positioning `node`', () => {
      expect(node).to.have.property('position')
      expect(node).to.have.nested.property('position.start')
      expect(node).to.not.have.nested.property('position.end')
    })

    it('should push `node` onto `stack`', () => {
      expect(subject.stack).to.have.length(2)
      expect(subject.stack).to.have.property('1', node)
    })

    it('should push stacked token onto token stack', () => {
      expect(subject.tokenStack).to.have.length(1)
      expect(subject.tokenStack).to.have.nested.property('0.0', tokens.succ)
      expect(subject.tokenStack).to.have.nested.property('0.1', onEnterError)
    })
  })

  describe('#exit', () => {
    let onExitError: Mock<OnExitError>

    beforeEach(() => {
      onExitError = vi.fn().mockName('onExitError').mockImplementation(thrower)
    })

    it('should error on empty token stack', () => {
      // Arrange
      const subject: CompileContext = testSubject()
      let error!: Error

      // Act
      try {
        subject.exit(tokens.fail, onExitError)
      } catch (e: unknown) {
        error = e as typeof error
      }

      // Expect
      expect(error).to.be.instanceof(Error)
      expect(error).to.have.property('cause')
      expect(error.cause).to.have.property('open', undefined)
      expect(error.cause).to.have.property('token', tokens.fail)
      expect(onExitError).not.toHaveBeenCalled()
      expect(pick(error, ['cause', 'message'])).toMatchSnapshot()
    })

    it('should error on token type mismatch', () => {
      // Arrange
      const fail: Token = tokens.fail
      const succ: Token = tokens.succ
      const subject: CompileContext = testSubject()

      // Setup
      subject.stack.push(node)
      subject.tokenStack.push([fail, onEnterError])

      // Act + Expect
      expect(() => subject.exit(succ, onExitError)).to.throw(boom)
      expect(error).toHaveBeenCalledOnce()
      expect(error).toHaveBeenCalledWith(succ, fail, onEnterError, onExitError)
      expect(vi.mocked(error).mock.contexts[0]).to.eq(subject)
    })

    it('should finish positioning last node on stack', () => {
      // Arrange
      const subject: CompileContext = testSubject()

      // Setup
      subject.stack.push(parent)
      subject.enter(node, tokens.succ)

      // Act
      subject.exit(tokens.succ)

      // Expect
      expect(node).to.have.nested.property('position.start')
      expect(node).to.have.nested.property('position.end')
    })
  })

  describe('#resume', () => {
    describe('empty stack', () => {
      it('should serialize last node', () => {
        // Arrange
        const subject: CompileContext = testSubject()

        // Act
        const result = subject.resume()

        // Expect
        expect(result).to.be.undefined
        expect(serializeNode).not.toHaveBeenCalled()
      })

      it('should serialize last node with custom serializer', () => {
        // Arrange
        const subject: CompileContext = testSubject({ serializeNode })

        // Act
        subject.resume()

        // Expect
        expect(serializeNode).toHaveBeenCalledExactlyOnceWith(undefined)
      })
    })

    describe('non-empty stack', () => {
      it('should serialize last node', () => {
        // Arrange
        const subject: CompileContext = testSubject()

        // Setup
        subject.stack.push(node)

        // Act
        const result = subject.resume()

        // Expect
        expect(result).to.be.a('string')
        expect(serializeNode).not.toHaveBeenCalled()
      })

      it('should serialize last node with custom serializer', () => {
        // Arrange
        const subject: CompileContext = testSubject({ serializeNode })

        // Setup
        subject.stack.push(node)

        // Act
        subject.resume()

        // Expect
        expect(serializeNode).toHaveBeenCalledExactlyOnceWith(node)
      })
    })
  })

  describe('#sliceSerialize', () => {
    it('should return empty string', () => {
      expect(testSubject().sliceSerialize(tokens.succ)).to.eq(chars.empty)
    })
  })
})

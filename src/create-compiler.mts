/**
 * @file createCompiler
 * @module mark-compiler/createCompiler
 */

import type { Extensions, Options } from '@flex-development/mark-compiler'
import { chars } from '@flex-development/mark-util-symbol'
import type {
  CompileContext,
  CreateNode,
  Extension,
  Handle,
  Node,
  OnEnterError,
  OnExitError,
  StackedToken,
  TakeExtension,
  Transform,
  Tree
} from '@flex-development/mark/ast'
import type { List } from '@flex-development/mark/core'
import type {
  Event,
  Position,
  SerializeOptions,
  Token,
  TokenType
} from '@flex-development/mark/parse'
import { u } from '@flex-development/unist-util-builder'
import {
  stringifyPosition
} from '@flex-development/unist-util-stringify-position'
import { ok } from 'devlop'
import error from './internal/error.mts'
import isList from './internal/is-list.mts'
import point from './internal/point.mts'
import positionTree from './internal/position-tree.mts'

export default createCompiler

/**
 * Create an event compiler.
 *
 * @see {@linkcode CompileContext}
 * @see {@linkcode Options}
 *
 * @this {void}
 *
 * @param {Options | null | undefined} [options]
 *  Options for creating the compiler
 * @return {CompileContext}
 *  The event compilation context
 */
function createCompiler(
  this: void,
  options?: Options | null | undefined
): CompileContext {
  options ??= {}

  /**
   * The event compilation context.
   *
   * @const {CompileContext} context
   */
  const context: CompileContext = {
    buffer,
    compile,
    config: { enter: {}, exit: {}, transforms: [] },
    data: {},
    enter,
    exit,
    from: point(options.from),
    resume,
    sliceSerialize,
    stack: [],
    tokenStack: []
  }

  return configure()

  /**
   * Capture some of the output data.
   *
   * @this {CompileContext}
   *
   * @return {undefined}
   */
  function buffer(this: CompileContext): undefined {
    return void this.stack.push(u('fragment', []))
  }

  /**
   * Create an exit handle.
   *
   * @template {TokenType} T
   *  The corresponding token type
   *
   * @this {void}
   *
   * @param {Handle<T> | null | undefined} [pre]
   *  The handle to run before exiting a node
   * @return {Handle<T>}
   *  The exit handle
   */
  function closer<T extends TokenType>(
    this: void,
    pre?: Handle<T> | null | undefined
  ): Handle<T>

  /**
   * Create an exit handle.
   *
   * @this {void}
   *
   * @param {Handle | null | undefined} [pre]
   *  The handle to run before exiting a node
   * @return {Handle}
   *  The exit handle
   */
  function closer(this: void, pre?: Handle | null | undefined): Handle {
    return close

    /**
     * @this {CompileContext}
     *
     * @param {Token} token
     *  The token to handle
     * @return {undefined}
     */
    function close(this: CompileContext, token: Token): undefined {
      return pre?.call(this, token), void exit.call(this, token)
    }
  }

  /**
   * Turn events into a syntax tree.
   *
   * @this {void}
   *
   * @param {Event[] | null | undefined} events
   *  The list of events
   * @return {Tree}
   *  The syntax tree
   */
  function compile(this: void, events?: Event[] | null | undefined): Tree {
    ok(options, 'expected `options`')
    events ??= []

    /**
     * The current index.
     *
     * @var {number} index
     */
    let index: number = -1

    /**
     * The syntax tree.
     *
     * @var {Tree} tree
     */
    let tree: Tree = u('root', {
      children: [],
      position: { end: point(context.from), start: point(context.from) }
    })

    // push tree onto the stack.
    context.stack.push(tree)

    // prepare to use `sliceSerialize` from tokenizers.
    if (context.sliceSerialize === sliceSerialize) {
      Reflect.deleteProperty(context, 'sliceSerialize')
    }

    // preprocess events before compilation.
    context.preprocess?.call(context, events, tree)

    // call token handlers.
    while (++index < events.length) {
      ok(events[index], 'expected `events[index]`')
      const [event, token, { sliceSerialize }] = events[index]!

      // use serializer from tokenizer.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      context.sliceSerialize ??= sliceSerialize

      // call token handler.
      context.config[event][token.type]?.call(context, token)
    }

    // handle tokens still being open.
    if (context.tokenStack.length > 0) {
      const [token, handler] = context.tokenStack.at(-1)!
      error.call(context, undefined, token, handler)
    }

    // position tree based on events.
    positionTree(tree, events)

    // apply tree transforms.
    return context.config.transforms.reduce((tree, transform) => {
      return transform(tree) ?? tree
    }, tree)
  }

  /**
   * Configure the compiler.
   *
   * @this {void}
   *
   * @return {CompileContext}
   *  The configured compiler
   */
  function configure(this: void): CompileContext {
    ok(options, 'expected `options`')

    // add preprocessor.
    context.preprocess = options.preprocess

    // finalize `context` before combining extensions
    // so finalized context is available to `options.takeExtension`.
    void options.finalizeContext?.(context, options)

    /**
     * The extension, or extensions, to merge.
     *
     * @var {Extensions} extensions
     */
    let extensions: Extensions = options.extensions ?? []

    // create extensions.
    if (typeof extensions === 'function') {
      extensions = extensions(opener, closer, buffer)
    }

    // normalize extensions.
    extensions = !isList(extensions) ? [extensions] : [...extensions]

    // combine extensions.
    void takeExtensions(extensions, options.takeExtension)

    return context
  }

  /**
   * Enter a node.
   *
   * @this {CompileContext}
   *
   * @param {Node} node
   *  The node to enter
   * @param {Token} token
   *  The corresponding token
   * @param {OnEnterError | null | undefined} [onError]
   *  Handle the case where another token is open, but closed by something else
   * @return {undefined}
   */
  function enter(
    this: CompileContext,
    node: Node,
    token: Token,
    onError?: OnEnterError | null | undefined
  ): undefined {
    /**
     * The last node on the stack.
     *
     * @const {Node | undefined} parent
     */
    const parent: Node | undefined = this.stack.at(-1)

    ok(parent, 'expected `parent`')
    ok('children' in parent, 'expected parent node')

    parent.children.push(node)
    this.stack.push(node)
    this.tokenStack.push([token, onError])
    node.position = { start: point(token.start) } as Position

    return void node
  }

  /**
   * Exit a node.
   *
   * @this {CompileContext}
   *
   * @param {Token} token
   *  The corresponding token
   * @param {OnExitError | null | undefined} [onError]
   *  Handle the case where another token is open
   * @return {undefined}
   * @throws {Error}
   *  If the token stack is empty
   */
  function exit(
    this: CompileContext,
    token: Token,
    onError?: OnExitError | null | undefined
  ): undefined {
    /**
     * The last stacked token.
     *
     * @const {StackedToken | undefined} stacked
     */
    const stacked: StackedToken | undefined = this.tokenStack.pop()

    // cannot close `token` if token stack is empty.
    if (!stacked) {
      /**
       * The reason for the exit error.
       *
       * @var {string} reason
       */
      let reason: string = 'Cannot close'

      // build full error message.
      reason += chars.space
      reason += chars.graveAccent + token.type + chars.graveAccent
      reason += chars.space + chars.leftParen
      reason += stringifyPosition([token.start, token.end])
      reason += chars.rightParen + chars.colon + chars.space + 'it\'s not open'

      throw new Error(reason, { cause: { open: stacked, token } })
    }

    // error on token type mismatch.
    if (stacked[0].type !== token.type) {
      error.call(this, token, stacked[0], stacked[1], onError)
    }

    /**
     * The last node on the stack.
     *
     * @const {Node | undefined} node
     */
    const node: Node | undefined = this.stack.pop()

    ok(node, 'expected `node`')
    ok(node.type !== 'fragment', 'unexpected fragment `exit`ed')
    ok(node.position, 'expected `node.position` to be defined')

    node.position.end = point(token.end)
    return void token
  }

  /**
   * Create an enter handle.
   *
   * @template {Node} N
   *  The node to create
   * @template {TokenType} T
   *  The corresponding token type
   *
   * @this {void}
   *
   * @param {CreateNode<N, T>} node
   *  The node factory
   * @param {Handle<T> | null | undefined} [and]
   *  The handle to run after entering the created node
   * @return {Handle<T>}
   *  The enter handle
   */
  function opener<N extends Node, T extends TokenType>(
    this: void,
    node: CreateNode<N, T>,
    and?: Handle<T> | null | undefined
  ): Handle<T>

  /**
   * Create an enter handle.
   *
   * @this {void}
   *
   * @param {CreateNode} node
   *  The node factory
   * @param {Handle | null | undefined} [and]
   *  The handle to run after entering the created node
   * @return {Handle}
   *  The enter handle
   */
  function opener(
    this: void,
    node: CreateNode,
    and?: Handle | null | undefined
  ): Handle {
    return open

    /**
     * @this {CompileContext}
     *
     * @param {Token} token
     *  The token to handle
     * @return {undefined}
     */
    function open(this: CompileContext, token: Token): undefined {
      return enter.call(this, node(token), token), void and?.call(this, token)
    }
  }

  /**
   * Stop capturing and access the output data.
   *
   * @see {@linkcode CompileContext}
   *
   * @this {CompileContext}
   *
   * @return {string | null | undefined}
   *  The captured output data
   */
  function resume(this: CompileContext): string | null | undefined {
    ok(options, 'expected `options`')

    /**
     * The last node on the stack.
     *
     * @const {Node | undefined} node
     */
    const node: Node | undefined = this.stack.pop()

    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (!options.serializeNode) return node ? String(node) : undefined

    return options.serializeNode(node)
  }

  /**
   * Get the text spanning `range`.
   *
   * @this {void}
   *
   * @param {Position} range
   *  The position in stream
   * @param {SerializeOptions | boolean | null | undefined} [options]
   *  Options for serializing or whether to expand tabs
   * @return {string}
   *  The serialized slice
   */
  function sliceSerialize(
    this: void,
    range: Position,
    options?: SerializeOptions | boolean | null | undefined
  ): string {
    return void range, void options, chars.empty
  }

  /**
   * Merge extensions into the compiler configuration.
   *
   * @this {void}
   *
   * @param {ReadonlyArray<Extension>} extensions
   *  The list of extensions to merge
   * @param {TakeExtension | null | undefined} [take]
   *  Merge additional extension fields into the compiler configuration
   * @return {undefined}
   */
  function takeExtensions(
    this: void,
    extensions: readonly Extension[],
    take?: TakeExtension | null | undefined
  ): undefined {
    /**
     * The index of the current extension.
     *
     * @var {number} index
     */
    let index: number = -1

    // combine extensions.
    while (++index < extensions.length) {
      /**
       * The current extension.
       *
       * @const {Extension | undefined} value
       */
      const extension: Extension | undefined = extensions[index]

      /**
       * The current {@linkcode extension} field.
       *
       * @var {keyof Extension} field
       */
      let field: keyof Extension

      ok(extension, 'expected `extension`')

      for (field in extension) {
        if (Object.hasOwnProperty.call(extension, field)) {
          switch (field) {
            case 'enter':
            case 'exit':
              Object.assign(context.config[field], extension[field])
              break
            case 'transforms':
              /**
               * The list of tree transforms to apply.
               *
               * @const {List<Transform> | null | undefined} tt
               */
              const tt: List<Transform> | null | undefined = extension[field]

              if (tt) context.config[field].push(...tt)
              break
            default:
              take?.(context.config, extension, field)
              break
          }
        }
      }
    }

    return void extensions
  }
}

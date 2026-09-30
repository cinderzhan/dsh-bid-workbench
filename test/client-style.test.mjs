import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import test from 'node:test'

test('workbench styles retain plugin ownership and recover after removal', async () => {
  const styles = []
  const head = {
    querySelector(selector) {
      const match = selector.match(/^style\[data-plugin-css="([^"]+)"\]$/)
      return styles.find(style => style.dataset.pluginCss === match?.[1]) || null
    },
    appendChild(style) { styles.push(style); style.parentNode = head }
  }
  const document = {
    head,
    createElement(tag) {
      assert.equal(tag, 'style')
      return {
        dataset: {}, textContent: '',
        remove() {
          const index = styles.indexOf(this)
          if (index !== -1) styles.splice(index, 1)
          this.parentNode = null
        }
      }
    }
  }
  const effects = []
  const cleanups = []
  const observers = []
  let plugin
  let panel
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useCallback: fn => fn,
    useState: initial => [typeof initial === 'function' ? initial() : initial, () => {}],
    useRef: value => ({ current: value }),
    useEffect: fn => effects.push(fn)
  }
  class MutationObserver {
    constructor(callback) { this.callback = callback; observers.push(this) }
    observe(target, options) { assert.equal(target, head); assert.equal(options.childList, true) }
    disconnect() { this.disconnected = true }
  }
  const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  runInNewContext(source, {
    window: { __ModuleLoader__: { load: value => { plugin = value.factory(() => React) } } },
    document, MutationObserver, navigator: { language: 'zh' },
    localStorage: { getItem: () => null }
  })
  plugin.apply({
    inject: (_services, activate) => activate({
      effect(fn) { cleanups.push(fn()) },
      desktopWorkbenches: { register: (_metadata, component) => { panel = component; return () => {} } }
    })
  })

  const selector = 'style[data-plugin-css="dsh-bid-workbench"]'
  assert.equal(head.querySelector(selector).dataset.plugin, 'dsh-bid-workbench')
  assert.match(head.querySelector(selector).textContent, /\.bidWb\{/)

  panel({ entry: { id: 'dsh-bid-workbench' } }).type({ entry: { id: 'dsh-bid-workbench' }, service: {}, hostCtx: {} })
  const stopObserving = effects[0]()
  effects[1]()
  assert.equal(observers.length, 1)

  head.querySelector(selector).remove()
  observers[0].callback()
  assert.equal(head.querySelector(selector).dataset.plugin, 'dsh-bid-workbench')
  assert.match(head.querySelector(selector).textContent, /\.bidWb\{/)

  head.querySelector(selector).remove()
  effects[1]()
  assert.equal(head.querySelector(selector).dataset.plugin, 'dsh-bid-workbench')

  stopObserving()
  assert.equal(observers[0].disconnected, true)
  cleanups[0]()
  assert.equal(head.querySelector(selector), null)
  observers[0].callback()
  assert.equal(head.querySelector(selector), null)
})

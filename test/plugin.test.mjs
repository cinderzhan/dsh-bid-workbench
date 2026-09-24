import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach } from 'node:test'
import { applyBidWorkbench, WORKBENCH_ID } from '../src/plugin.mjs'

const roots = []
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })
function context(readOwnership) {
  const tools = new Map()
  const agent = { id: 'session-1', ctx: { tools: { register(tool) { tools.set(tool.name, tool); return () => tools.delete(tool.name) } } } }
  const cleanups = []
  return {
    tools, agent, cleanups,
    ctx: {
      desktopWorkbenchOwnership: { read: readOwnership },
      agents: { list: () => [agent], get: id => id === agent.id ? agent : undefined },
      connection: { fetch: { register() {} } },
      on() {},
      effect(fn) { const dispose = fn(); if (typeof dispose === 'function') cleanups.push(dispose) }
    }
  }
}

test('registers tools only for canonical host ownership and re-checks on execute', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-bid-plugin-')); roots.push(root)
  let snapshot = { added: [WORKBENCH_ID], sessionBindings: { 'session-1': WORKBENCH_ID } }
  const fixture = context(async () => snapshot)
  const result = applyBidWorkbench(fixture.ctx, { root }, { defineTool: value => value })
  assert.equal(result, undefined, 'Cordis apply must not return a Promise or plain-object effect')
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual([...fixture.tools.keys()].sort(), ['bid_workbench_read', 'bid_workbench_update'])
  snapshot = { added: [WORKBENCH_ID], sessionBindings: { 'session-1': 'other/workbench' } }
  await assert.rejects(fixture.tools.get('bid_workbench_read').execute({}, { agent: fixture.agent }), error => error.code === 'OWNERSHIP_REQUIRED')
  fixture.cleanups.forEach(dispose => dispose())
})

test('fails closed and exposes no tools when ownership cannot be read', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-bid-plugin-')); roots.push(root)
  const fixture = context(async () => { throw new Error('corrupt host state') })
  const result = applyBidWorkbench(fixture.ctx, { root }, { defineTool: value => value })
  assert.equal(result, undefined, 'Cordis apply must not return a Promise or plain-object effect')
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(fixture.tools.size, 0)
  fixture.cleanups.forEach(dispose => dispose())
})

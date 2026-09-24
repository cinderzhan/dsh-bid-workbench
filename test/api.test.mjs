import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach } from 'node:test'
import { createApiRoutes, WORKBENCH_ID } from '../src/api.mjs'
import { BidStore } from '../src/store.mjs'

const roots = []
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })
async function fixture(ownership) {
  const root = await mkdtemp(join(tmpdir(), 'dsh-bid-api-')); roots.push(root)
  const store = new BidStore(root)
  const routes = createApiRoutes({ store, readOwnership: async () => ownership })
  return { store, route: path => routes.find(item => item.path.endsWith(path)) }
}
const post = body => new Request('http://local/api', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })

test('exposes no-store JSON state and basic mutation behavior', async () => {
  const { route } = await fixture({ added: [], sessionBindings: {} })
  const initial = await route('/state').fetch(new Request('http://local/api'))
  assert.equal(initial.status, 200)
  assert.equal(initial.headers.get('cache-control'), 'no-store')
  assert.equal((await initial.json()).revision, 0)
  const created = await route('/mutate').fetch(post({ action: 'createProject', expectedRevision: 0, data: { name: 'Bid', client: '', currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } }))
  assert.equal(created.status, 200)
  assert.equal((await created.json()).revision, 1)
  const stale = await route('/mutate').fetch(post({ action: 'createProject', expectedRevision: 0, data: { name: 'Stale', client: '', currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } }))
  assert.equal(stale.status, 409)
})

test('requires JSON and host canonical ownership before binding a session', async () => {
  const denied = await fixture({ added: [WORKBENCH_ID], sessionBindings: { session: 'someone/else' } })
  await denied.store.mutate({ action: 'upsert', entity: 'projects', id: 'p1', expectedRevision: 0, data: { name: 'Bid', client: '', currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } })
  const noJson = await denied.route('/mutate').fetch(new Request('http://local/api', { method: 'POST', body: '{}' }))
  assert.equal(noJson.status, 415)
  const forbidden = await denied.route('/bind-session').fetch(post({ sessionId: 'session', projectId: 'p1', expectedRevision: 1 }))
  assert.equal(forbidden.status, 403)

  const allowed = await fixture({ added: [WORKBENCH_ID], sessionBindings: { session: WORKBENCH_ID } })
  await allowed.store.mutate({ action: 'upsert', entity: 'projects', id: 'p1', expectedRevision: 0, data: { name: 'Bid', client: '', currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } })
  const response = await allowed.route('/bind-session').fetch(post({ sessionId: 'session', projectId: 'p1', expectedRevision: 1 }))
  assert.equal(response.status, 200)
  assert.equal((await response.json()).bindings[0].sessionId, 'session')
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach } from 'node:test'
import { BidStore } from '../src/store.mjs'

const roots = []
afterEach(async () => { await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true }))) })
async function fixture() { const root = await mkdtemp(join(tmpdir(), 'dsh-bid-')); roots.push(root); return { root, store: new BidStore(root) } }
const create = expectedRevision => ({ action: 'createProject', expectedRevision, data: { name: 'Bid', client: '', currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } })

test('atomically persists with private permissions and no leftover temp files', async () => {
  const { root, store } = await fixture()
  const saved = await store.mutate(create(0))
  assert.equal(saved.revision, 1)
  assert.deepEqual(await readdir(root), ['state.json'])
  assert.equal((await stat(join(root, 'state.json'))).mode & 0o777, 0o600)
  assert.equal((await new BidStore(root).read()).projects[0].name, 'Bid')
})

test('serializes writers and rejects a stale revision without losing the winner', async () => {
  const { store } = await fixture()
  const results = await Promise.allSettled([store.mutate(create(0)), store.mutate(create(0))])
  assert.equal(results.filter(result => result.status === 'fulfilled').length, 1)
  const rejected = results.find(result => result.status === 'rejected')
  assert.equal(rejected.reason.code, 'REVISION_CONFLICT')
  assert.equal((await store.read()).projects.length, 1)
})

test('fails closed on corrupted state and never overwrites it', async () => {
  const { root, store } = await fixture()
  const file = join(root, 'state.json')
  await writeFile(file, '{broken', { mode: 0o600 })
  await assert.rejects(store.read(), error => error.code === 'CORRUPT_STATE' && error.status === 500)
  await assert.rejects(store.mutate(create(0)), error => error.code === 'CORRUPT_STATE')
  assert.equal(await readFile(file, 'utf8'), '{broken')
})

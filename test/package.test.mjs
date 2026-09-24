import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
test('package, exports and patch follow the Desktop workbench contract', async () => {
  const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(pkg.name, 'dsh-bid-workbench')
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/)
  assert.equal(pkg.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(pkg.dsh.client.platform, 'web')
  assert.ok(pkg.dsh.client.inject.includes('dsh-desktop-workbenches'))
  for (const key of ['.', './client', './package.json', './cordis.patch.yml']) assert.ok(pkg.exports[key])
  assert.equal(pkg.dependencies, undefined)
  for (const dependency of ['@deepseek-ai/cordis', '@deepseek-ai/dsh-agent', '@deepseek-ai/dsh-client-connection', '@deepseek-ai/dsh-tools', '@deepseek-ai/schemastery']) assert.ok(pkg.peerDependencies[dependency])
  const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8')
  assert.match(patch, /name: dsh-bid-workbench/)
  assert.match(patch, /root: !!js dshHomePath\('bid-workbench'\)/)
  const client = await readFile(new URL('lib/client.js', root), 'utf8')
  assert.doesNotMatch(client, /desktopWorkbenches\.register\(\{[^}]*\bid\s*:/s)
  assert.match(client, /businessSide: 'left', businessWidth: 0\.6/)
})

import { mkdir, open, readFile, rename, stat, unlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { applyMutation, BidStateError, bindSession, emptyState, validateState } from './model.mjs'

export const MAX_STATE_BYTES = 1_000_000

export class BidStore {
  constructor(rootOrFile) {
    this.file = rootOrFile.endsWith('.json') ? rootOrFile : join(rootOrFile, 'state.json')
    this.queue = Promise.resolve()
  }

  async #readUnsafe() {
    try {
      const info = await stat(this.file)
      if (info.size > MAX_STATE_BYTES) throw new BidStateError('投标工作台状态文件超过大小上限，已停止读取以避免覆盖。', 500, 'STATE_TOO_LARGE')
      const source = await readFile(this.file, 'utf8')
      if (Buffer.byteLength(source) > MAX_STATE_BYTES) throw new BidStateError('投标工作台状态文件超过大小上限，已停止读取以避免覆盖。', 500, 'STATE_TOO_LARGE')
      try { return validateState(JSON.parse(source)) }
      catch (error) {
        if (error instanceof BidStateError && error.status === 500) throw error
        throw new BidStateError(`投标工作台状态文件已损坏或不兼容：${error.message}`, 500, 'CORRUPT_STATE')
      }
    } catch (error) {
      if (error?.code === 'ENOENT') return emptyState()
      if (error instanceof BidStateError) throw error
      throw new BidStateError(`无法读取投标工作台状态：${error.message}`, 500, 'READ_FAILED')
    }
  }

  async read() {
    await this.queue.catch(() => {})
    return structuredClone(await this.#readUnsafe())
  }

  async #persist(state) {
    const validated = validateState(state)
    const body = `${JSON.stringify(validated, null, 2)}\n`
    if (Buffer.byteLength(body) > MAX_STATE_BYTES) throw new BidStateError('保存后的状态超过大小上限，请归档不再使用的数据。', 413, 'STATE_TOO_LARGE')
    const directory = dirname(this.file)
    await mkdir(directory, { recursive: true, mode: 0o700 })
    const temporary = join(directory, `.state-${process.pid}-${randomUUID()}.tmp`)
    let handle
    try {
      handle = await open(temporary, 'wx', 0o600)
      await handle.writeFile(body, 'utf8')
      await handle.sync()
      await handle.close()
      handle = null
      await rename(temporary, this.file)
      const directoryHandle = await open(directory, 'r')
      try { await directoryHandle.sync() } finally { await directoryHandle.close() }
    } catch (error) {
      try { await handle?.close() } catch {}
      try { await unlink(temporary) } catch {}
      if (error instanceof BidStateError) throw error
      throw new BidStateError(`无法原子保存投标工作台状态：${error.message}`, 500, 'WRITE_FAILED')
    }
    return structuredClone(validated)
  }

  #serialize(operation) {
    const result = this.queue.catch(() => {}).then(operation)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  mutate(command) {
    return this.#serialize(async () => {
      const current = await this.#readUnsafe()
      return this.#persist(applyMutation(current, command))
    })
  }

  bind(command) {
    return this.#serialize(async () => {
      const current = await this.#readUnsafe()
      return this.#persist(bindSession(current, command))
    })
  }
}

export function createBidStore(root) { return new BidStore(root) }

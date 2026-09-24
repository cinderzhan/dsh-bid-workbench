import { BidStateError } from './model.mjs'

export const API_PREFIX = '/api/bid-workbench'
export const MAX_BODY_BYTES = 256_000
export const WORKBENCH_ID = 'cinderzhan/dsh-bid-workbench'

export async function readJsonBody(request, maximum = MAX_BODY_BYTES) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) throw new BidStateError('请求必须使用 application/json。', 415, 'UNSUPPORTED_MEDIA_TYPE')
  const declared = Number(request.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maximum) throw new BidStateError('请求内容过大。', 413, 'BODY_TOO_LARGE')
  const reader = request.body?.getReader()
  if (!reader) throw new BidStateError('请求缺少 JSON body。')
  const chunks = []
  let length = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      length += value.byteLength
      if (length > maximum) {
        await reader.cancel()
        throw new BidStateError('请求内容过大。', 413, 'BODY_TOO_LARGE')
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  catch { throw new BidStateError('JSON 格式无效。', 400, 'INVALID_JSON') }
}

function json(value, status = 200) {
  return Response.json(value, { status, headers: { 'cache-control': 'no-store' } })
}

function failure(error) {
  const known = error instanceof BidStateError
  return json({ error: known ? error.message : '投标工作台服务暂时不可用。', code: known ? error.code : 'INTERNAL_ERROR' }, known ? error.status : 500)
}

export function ownershipAllows(snapshot, sessionId) {
  return Boolean(snapshot && Array.isArray(snapshot.added) && snapshot.added.includes(WORKBENCH_ID) && snapshot.sessionBindings && snapshot.sessionBindings[sessionId] === WORKBENCH_ID)
}

export function createApiRoutes({ store, readOwnership, onBound = () => {} }) {
  return [
    {
      path: `${API_PREFIX}/state`, methods: ['GET'], requestBody: 'buffered',
      async fetch() {
        try { return json(await store.read()) } catch (error) { return failure(error) }
      }
    },
    {
      path: `${API_PREFIX}/mutate`, methods: ['POST'], requestBody: 'buffered',
      async fetch(request) {
        try { return json(await store.mutate(await readJsonBody(request))) } catch (error) { return failure(error) }
      }
    },
    {
      path: `${API_PREFIX}/bind-session`, methods: ['POST'], requestBody: 'buffered',
      async fetch(request) {
        try {
          const body = await readJsonBody(request)
          if (!body || typeof body.sessionId !== 'string') throw new BidStateError('sessionId 不能为空。')
          const ownership = await readOwnership()
          if (!ownershipAllows(ownership, body.sessionId)) throw new BidStateError('宿主未确认此会话属于投标作战室，不能写入业务绑定。', 403, 'OWNERSHIP_REQUIRED')
          const state = await store.bind(body)
          await onBound(body.sessionId)
          return json(state)
        } catch (error) { return failure(error) }
      }
    }
  ]
}

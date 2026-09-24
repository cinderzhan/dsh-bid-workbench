import { randomUUID } from 'node:crypto'

export const STATE_VERSION = 1
export const ENTITY_NAMES = ['projects', 'requirements', 'risks', 'tasks', 'decisions', 'analyses', 'bindings']
export const AGENT_ENTITIES = ['requirements', 'risks', 'tasks', 'decisions', 'analyses']

export class BidStateError extends Error {
  constructor(message, status = 400, code = 'INVALID_STATE') {
    super(message)
    this.name = 'BidStateError'
    this.status = status
    this.code = code
  }
}

const ENUMS = {
  projectStatus: ['draft', 'evaluating', 'bidding', 'submitted', 'won', 'lost', 'archived'],
  recommendation: ['GO', 'CONDITIONAL_GO', 'NO_GO', 'UNASSESSED'],
  requirementKind: ['mandatory', 'scored', 'informational'],
  requirementStatus: ['met', 'partial', 'unmet', 'unknown'],
  severity: ['blocker', 'high', 'medium', 'low'],
  riskStatus: ['open', 'mitigated', 'accepted'],
  priority: ['critical', 'high', 'medium', 'low'],
  taskStatus: ['todo', 'doing', 'done', 'blocked'],
  decisionStatus: ['pending', 'decided', 'parked']
}

const STATE_KEYS = ['schemaVersion', 'revision', ...ENTITY_NAMES]
const ENTITY_KEYS = {
  projects: ['id', 'name', 'client', 'submissionDate', 'budgetLimit', 'quotedAmount', 'currency', 'recommendation', 'status', 'summary', 'createdAt', 'updatedAt', 'archivedAt'],
  requirements: ['id', 'projectId', 'title', 'kind', 'status', 'evidence', 'owner', 'sourceRefs', 'createdAt', 'updatedAt', 'archivedAt'],
  risks: ['id', 'projectId', 'title', 'severity', 'status', 'mitigation', 'owner', 'sourceRefs', 'createdAt', 'updatedAt', 'archivedAt'],
  tasks: ['id', 'projectId', 'title', 'owner', 'dueDate', 'priority', 'status', 'sourceRefs', 'createdAt', 'updatedAt', 'archivedAt'],
  decisions: ['id', 'projectId', 'title', 'status', 'outcome', 'rationale', 'sourceRefs', 'createdAt', 'updatedAt', 'archivedAt'],
  analyses: ['id', 'projectId', 'summary', 'recommendation', 'sourceRefs', 'createdAt', 'updatedAt', 'archivedAt'],
  bindings: ['sessionId', 'projectId', 'lastUsedAt', 'archivedAt']
}

const PATCH_KEYS = Object.fromEntries(Object.entries(ENTITY_KEYS).map(([name, keys]) => [name, keys.filter(key => !['id', 'createdAt', 'updatedAt', 'archivedAt', 'sessionId'].includes(key))]))

export function emptyState() {
  return { schemaVersion: STATE_VERSION, revision: 0, projects: [], requirements: [], risks: [], tasks: [], decisions: [], analyses: [], bindings: [] }
}

function plain(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new BidStateError(`${label}必须是对象。`)
  return value
}

function strictKeys(value, allowed, label) {
  plain(value, label)
  const extra = Object.keys(value).filter(key => !allowed.includes(key))
  if (extra.length) throw new BidStateError(`${label}包含不允许的字段：${extra.join(', ')}。`)
}

function text(value, label, { required = false, max = 4000 } = {}) {
  if (value == null && !required) return undefined
  if (typeof value !== 'string') throw new BidStateError(`${label}必须是文本。`)
  const result = value.trim()
  if (required && !result) throw new BidStateError(`${label}不能为空。`)
  if (result.length > max) throw new BidStateError(`${label}不能超过 ${max} 个字符。`)
  return result
}

function id(value, label) {
  const result = text(value, label, { required: true, max: 100 })
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]{0,99}$/.test(result)) throw new BidStateError(`${label}格式无效。`)
  return result
}

function enumValue(value, allowed, label) {
  if (!allowed.includes(value)) throw new BidStateError(`${label}必须是：${allowed.join('、')}。`)
  return value
}

function optionalNumber(value, label) {
  if (value == null) return undefined
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000_000) throw new BidStateError(`${label}必须是有效的非负数字。`)
  return value
}

function date(value, label, required = false) {
  if (value == null || value === '') {
    if (required) throw new BidStateError(`${label}不能为空。`)
    return undefined
  }
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new BidStateError(`${label}必须是 YYYY-MM-DD 日期。`)
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) throw new BidStateError(`${label}必须是有效的 YYYY-MM-DD 日期。`)
  return value
}

function timestamp(value, label, required = true) {
  if (value == null && !required) return undefined
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) throw new BidStateError(`${label}必须是 ISO 时间。`)
  return new Date(value).toISOString()
}

function sourceRefs(value, label = '来源引用') {
  if (value == null) return []
  if (!Array.isArray(value) || value.length > 40) throw new BidStateError(`${label}必须是最多 40 项的数组。`)
  return value.map((entry, index) => {
    strictKeys(entry, ['path', 'locator', 'note'], `${label}[${index}]`)
    const path = text(entry.path, `${label}[${index}].path`, { required: true, max: 500 })
    if (path.startsWith('/') || path.startsWith('\\') || /(^|[\\/])\.\.([\\/]|$)/.test(path)) throw new BidStateError(`${label}[${index}].path 必须是安全的相对路径。`)
    return {
      path,
      ...(entry.locator == null ? {} : { locator: text(entry.locator, `${label}[${index}].locator`, { max: 200 }) }),
      ...(entry.note == null ? {} : { note: text(entry.note, `${label}[${index}].note`, { max: 500 }) })
    }
  })
}

function base(record, entity, index) {
  strictKeys(record, ENTITY_KEYS[entity], `${entity}[${index}]`)
  const common = {
    id: id(record.id, `${entity}[${index}].id`),
    createdAt: timestamp(record.createdAt, `${entity}[${index}].createdAt`),
    updatedAt: timestamp(record.updatedAt, `${entity}[${index}].updatedAt`)
  }
  if (record.archivedAt != null) common.archivedAt = timestamp(record.archivedAt, `${entity}[${index}].archivedAt`)
  return common
}

function validateEntity(record, entity, index) {
  if (entity === 'bindings') {
    strictKeys(record, ENTITY_KEYS.bindings, `bindings[${index}]`)
    return {
      sessionId: id(record.sessionId, `bindings[${index}].sessionId`),
      projectId: id(record.projectId, `bindings[${index}].projectId`),
      lastUsedAt: timestamp(record.lastUsedAt, `bindings[${index}].lastUsedAt`),
      ...(record.archivedAt == null ? {} : { archivedAt: timestamp(record.archivedAt, `bindings[${index}].archivedAt`) })
    }
  }
  const common = base(record, entity, index)
  if (entity === 'projects') return {
    ...common,
    name: text(record.name, `projects[${index}].name`, { required: true, max: 160 }),
    client: text(record.client, `projects[${index}].client`, { max: 160 }) || '',
    ...(record.submissionDate ? { submissionDate: date(record.submissionDate, `projects[${index}].submissionDate`) } : {}),
    ...(record.budgetLimit == null ? {} : { budgetLimit: optionalNumber(record.budgetLimit, `projects[${index}].budgetLimit`) }),
    ...(record.quotedAmount == null ? {} : { quotedAmount: optionalNumber(record.quotedAmount, `projects[${index}].quotedAmount`) }),
    currency: text(record.currency ?? 'CNY', `projects[${index}].currency`, { required: true, max: 8 }).toUpperCase(),
    recommendation: enumValue(record.recommendation ?? 'UNASSESSED', ENUMS.recommendation, `projects[${index}].recommendation`),
    status: enumValue(record.status ?? 'draft', ENUMS.projectStatus, `projects[${index}].status`),
    summary: text(record.summary, `projects[${index}].summary`, { max: 4000 }) || ''
  }
  const projectId = id(record.projectId, `${entity}[${index}].projectId`)
  const refs = sourceRefs(record.sourceRefs, `${entity}[${index}].sourceRefs`)
  if (entity === 'requirements') return { ...common, projectId, title: text(record.title, `requirements[${index}].title`, { required: true, max: 300 }), kind: enumValue(record.kind ?? 'mandatory', ENUMS.requirementKind, `requirements[${index}].kind`), status: enumValue(record.status ?? 'unknown', ENUMS.requirementStatus, `requirements[${index}].status`), evidence: text(record.evidence, `requirements[${index}].evidence`, { max: 4000 }) || '', owner: text(record.owner, `requirements[${index}].owner`, { max: 120 }) || '', sourceRefs: refs }
  if (entity === 'risks') return { ...common, projectId, title: text(record.title, `risks[${index}].title`, { required: true, max: 300 }), severity: enumValue(record.severity ?? 'medium', ENUMS.severity, `risks[${index}].severity`), status: enumValue(record.status ?? 'open', ENUMS.riskStatus, `risks[${index}].status`), mitigation: text(record.mitigation, `risks[${index}].mitigation`, { max: 4000 }) || '', owner: text(record.owner, `risks[${index}].owner`, { max: 120 }) || '', sourceRefs: refs }
  if (entity === 'tasks') return { ...common, projectId, title: text(record.title, `tasks[${index}].title`, { required: true, max: 300 }), owner: text(record.owner, `tasks[${index}].owner`, { max: 120 }) || '', ...(record.dueDate ? { dueDate: date(record.dueDate, `tasks[${index}].dueDate`) } : {}), priority: enumValue(record.priority ?? 'medium', ENUMS.priority, `tasks[${index}].priority`), status: enumValue(record.status ?? 'todo', ENUMS.taskStatus, `tasks[${index}].status`), sourceRefs: refs }
  if (entity === 'decisions') return { ...common, projectId, title: text(record.title, `decisions[${index}].title`, { required: true, max: 300 }), status: enumValue(record.status ?? 'pending', ENUMS.decisionStatus, `decisions[${index}].status`), outcome: text(record.outcome, `decisions[${index}].outcome`, { max: 4000 }) || '', rationale: text(record.rationale, `decisions[${index}].rationale`, { max: 4000 }) || '', sourceRefs: refs }
  if (entity === 'analyses') return { ...common, projectId, summary: text(record.summary, `analyses[${index}].summary`, { required: true, max: 12000 }), recommendation: enumValue(record.recommendation ?? 'UNASSESSED', ENUMS.recommendation, `analyses[${index}].recommendation`), sourceRefs: refs }
  throw new BidStateError(`未知实体：${entity}。`)
}

export function validateState(input) {
  strictKeys(input, STATE_KEYS, '状态')
  if (input.schemaVersion !== STATE_VERSION) throw new BidStateError(`不支持的状态版本：${input.schemaVersion}。`)
  if (!Number.isSafeInteger(input.revision) || input.revision < 0) throw new BidStateError('revision 必须是非负整数。')
  const state = { schemaVersion: STATE_VERSION, revision: input.revision }
  for (const entity of ENTITY_NAMES) {
    if (!Array.isArray(input[entity]) || input[entity].length > 10_000) throw new BidStateError(`${entity} 必须是最多 10000 项的数组。`)
    state[entity] = input[entity].map((record, index) => validateEntity(record, entity, index))
    const keys = state[entity].map(record => entity === 'bindings' ? record.sessionId : record.id)
    if (new Set(keys).size !== keys.length) throw new BidStateError(`${entity} 包含重复标识。`)
  }
  const projects = new Set(state.projects.map(project => project.id))
  for (const entity of ENTITY_NAMES.filter(name => !['projects'].includes(name))) {
    for (const record of state[entity]) if (!projects.has(record.projectId)) throw new BidStateError(`${entity} 引用了不存在的项目 ${record.projectId}。`)
  }
  return state
}

function normalizePatch(entity, patch) {
  strictKeys(patch, PATCH_KEYS[entity], `${entity} data`)
  return patch
}

function now() { return new Date().toISOString() }

function createRecord(entity, recordId, data, at) {
  const candidate = { id: recordId || randomUUID(), ...data, createdAt: at, updatedAt: at }
  return validateEntity(candidate, entity, 0)
}

function projectExists(state, projectId) {
  return state.projects.some(project => project.id === projectId && !project.archivedAt)
}

export function applyMutation(inputState, command) {
  const state = validateState(structuredClone(inputState))
  strictKeys(command, ['action', 'entity', 'id', 'data', 'expectedRevision'], 'mutation')
  if (!Number.isSafeInteger(command.expectedRevision) || command.expectedRevision < 0) throw new BidStateError('expectedRevision 必须是非负整数。')
  if (command.expectedRevision !== state.revision) throw new BidStateError('数据已被其他操作更新，请刷新后重试。', 409, 'REVISION_CONFLICT')
  const at = now()
  if (command.action === 'createProject') {
    if (command.entity != null || command.id != null) throw new BidStateError('createProject 不接受 entity 或 id。')
    const data = normalizePatch('projects', plain(command.data, 'data'))
    state.projects.push(createRecord('projects', null, data, at))
  } else if (command.action === 'upsert') {
    if (!ENTITY_NAMES.filter(name => name !== 'bindings').includes(command.entity)) throw new BidStateError('upsert 的 entity 无效。')
    const data = normalizePatch(command.entity, plain(command.data, 'data'))
    const list = state[command.entity]
    const index = command.id == null ? -1 : list.findIndex(record => record.id === command.id)
    if (command.entity !== 'projects') {
      const targetProject = index >= 0 ? list[index].projectId : data.projectId
      if (!projectExists(state, targetProject)) throw new BidStateError('目标项目不存在或已归档。')
      if (index >= 0 && data.projectId != null && data.projectId !== list[index].projectId) throw new BidStateError('不能把记录移动到另一个项目。')
    }
    if (index >= 0) {
      if (list[index].archivedAt) throw new BidStateError('已归档记录不能修改。')
      list[index] = validateEntity({ ...list[index], ...data, updatedAt: at }, command.entity, index)
    } else {
      list.push(createRecord(command.entity, command.id, data, at))
    }
  } else if (command.action === 'archive') {
    if (!ENTITY_NAMES.filter(name => name !== 'bindings').includes(command.entity)) throw new BidStateError('archive 的 entity 无效。')
    if (command.data != null) throw new BidStateError('archive 不接受 data。')
    const recordId = id(command.id, 'id')
    const record = state[command.entity].find(item => item.id === recordId)
    if (!record) throw new BidStateError('要归档的记录不存在。', 404, 'NOT_FOUND')
    if (!record.archivedAt) { record.archivedAt = at; record.updatedAt = at }
    if (command.entity === 'projects') {
      for (const entity of ENTITY_NAMES.filter(name => !['projects', 'bindings'].includes(name))) for (const item of state[entity]) if (item.projectId === recordId && !item.archivedAt) { item.archivedAt = at; item.updatedAt = at }
      for (const binding of state.bindings) if (binding.projectId === recordId && !binding.archivedAt) binding.archivedAt = at
    }
  } else {
    throw new BidStateError('不支持的 mutation action。')
  }
  state.revision += 1
  return validateState(state)
}

export function bindSession(inputState, command) {
  const state = validateState(structuredClone(inputState))
  strictKeys(command, ['sessionId', 'projectId', 'expectedRevision'], 'bind-session')
  if (!Number.isSafeInteger(command.expectedRevision) || command.expectedRevision !== state.revision) throw new BidStateError('数据已被其他操作更新，请刷新后重试。', 409, 'REVISION_CONFLICT')
  const sessionId = id(command.sessionId, 'sessionId')
  const projectId = id(command.projectId, 'projectId')
  if (!projectExists(state, projectId)) throw new BidStateError('目标项目不存在或已归档。', 404, 'NOT_FOUND')
  const at = now()
  const existing = state.bindings.find(binding => binding.sessionId === sessionId)
  if (existing) {
    if (existing.projectId !== projectId) throw new BidStateError('已有会话不能改绑到另一个投标项目。', 409, 'SESSION_ALREADY_BOUND')
    existing.lastUsedAt = at
    delete existing.archivedAt
  } else state.bindings.push({ sessionId, projectId, lastUsedAt: at })
  state.revision += 1
  return validateState(state)
}

export function activeProjectView(state, sessionId) {
  const valid = validateState(state)
  const binding = valid.bindings.find(item => item.sessionId === sessionId && !item.archivedAt)
  if (!binding) throw new BidStateError('当前会话尚未绑定投标项目，请从投标作战室连接资料或继续已有会话。', 403, 'PROJECT_NOT_BOUND')
  const project = valid.projects.find(item => item.id === binding.projectId && !item.archivedAt)
  if (!project) throw new BidStateError('绑定的投标项目不存在或已归档。', 404, 'NOT_FOUND')
  const scoped = { schemaVersion: valid.schemaVersion, revision: valid.revision, binding, project }
  for (const entity of AGENT_ENTITIES) scoped[entity] = valid[entity].filter(item => item.projectId === project.id && !item.archivedAt)
  return scoped
}

export function assertAgentMutation(state, sessionId, command) {
  const view = activeProjectView(state, sessionId)
  if (!command || typeof command !== 'object' || Array.isArray(command)) throw new BidStateError('Agent mutation 必须是对象。')
  if (!['upsert', 'archive'].includes(command.action) || !AGENT_ENTITIES.includes(command.entity)) throw new BidStateError('Agent 只能新增、更新或归档要求、风险、任务、决策和分析，不能修改项目或会话归属。', 403, 'FORBIDDEN_MUTATION')
  if (!Number.isSafeInteger(command.expectedRevision)) throw new BidStateError('Agent mutation 必须提供最新 expectedRevision。')
  if (command.action === 'upsert') {
    if (!command.data || typeof command.data !== 'object' || Array.isArray(command.data)) throw new BidStateError('upsert 必须提供 data。')
    if (command.id) {
      const current = state[command.entity].find(item => item.id === command.id)
      if (!current || current.projectId !== view.project.id) throw new BidStateError('Agent 只能更新当前绑定项目的数据。', 403, 'WRONG_PROJECT')
    } else if (command.data.projectId !== view.project.id) throw new BidStateError('新增记录的 projectId 必须是当前绑定项目。', 403, 'WRONG_PROJECT')
    if (command.data.projectId != null && command.data.projectId !== view.project.id) throw new BidStateError('Agent 不能修改其他项目的数据。', 403, 'WRONG_PROJECT')
  } else {
    const current = state[command.entity].find(item => item.id === command.id)
    if (!current || current.projectId !== view.project.id) throw new BidStateError('Agent 只能归档当前绑定项目的数据。', 403, 'WRONG_PROJECT')
  }
  return view
}

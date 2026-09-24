import test from 'node:test'
import assert from 'node:assert/strict'
import { activeProjectView, applyMutation, assertAgentMutation, bindSession, emptyState, validateState } from '../src/model.mjs'

function project(state = emptyState(), id = 'project-1') {
  return applyMutation(state, { action: 'upsert', entity: 'projects', id, expectedRevision: state.revision, data: {
    name: 'Test bid', client: 'Buyer', submissionDate: '2026-10-20', budgetLimit: 100, quotedAmount: 90,
    currency: 'CNY', recommendation: 'GO', status: 'evaluating', summary: ''
  } })
}

test('validates strict fields, dates, enums and safe source references', () => {
  assert.throws(() => validateState({ ...emptyState(), surprise: true }), /不允许的字段/)
  let state = project()
  assert.throws(() => applyMutation(state, { action: 'upsert', entity: 'tasks', expectedRevision: 1, data: { projectId: 'project-1', title: 'Task', dueDate: 'tomorrow', priority: 'high', status: 'todo', owner: '', sourceRefs: [] } }), /YYYY-MM-DD/)
  assert.throws(() => applyMutation(state, { action: 'upsert', entity: 'tasks', expectedRevision: 1, data: { projectId: 'project-1', title: 'Task', dueDate: '2026-02-30', priority: 'high', status: 'todo', owner: '', sourceRefs: [] } }), /有效的 YYYY-MM-DD/)
  assert.throws(() => applyMutation(state, { action: 'upsert', entity: 'requirements', expectedRevision: 1, data: { projectId: 'project-1', title: 'Req', kind: 'mandatory', status: 'unknown', evidence: '', owner: '', sourceRefs: [{ path: '../secret' }] } }), /安全的相对路径/)
  assert.throws(() => applyMutation(state, { action: 'upsert', entity: 'risks', expectedRevision: 1, data: { projectId: 'project-1', title: 'Risk', severity: 'urgent', status: 'open', mitigation: '', owner: '', sourceRefs: [] } }), /必须是/)
})

test('uses revision optimistic locking and keeps bindings separate', () => {
  let state = project()
  assert.equal(state.revision, 1)
  assert.throws(() => applyMutation(state, { action: 'upsert', entity: 'projects', id: 'project-1', expectedRevision: 0, data: { summary: 'stale' } }), error => error.code === 'REVISION_CONFLICT' && error.status === 409)
  state = bindSession(state, { sessionId: 'session-1', projectId: 'project-1', expectedRevision: 1 })
  assert.equal(activeProjectView(state, 'session-1').project.name, 'Test bid')
  assert.equal(state.revision, 2)
})

test('does not move an existing session binding between projects', () => {
  let state = project()
  state = project(state, 'project-2')
  state = bindSession(state, { sessionId: 'session-1', projectId: 'project-1', expectedRevision: state.revision })
  assert.throws(() => bindSession(state, { sessionId: 'session-1', projectId: 'project-2', expectedRevision: state.revision }), error => error.code === 'SESSION_ALREADY_BOUND' && error.status === 409)
})

test('agent mutations reject projects, bindings and other projects', () => {
  let state = project()
  state = project(state, 'project-2')
  state = bindSession(state, { sessionId: 'session-1', projectId: 'project-1', expectedRevision: state.revision })
  assert.throws(() => assertAgentMutation(state, 'session-1', { action: 'upsert', entity: 'projects', expectedRevision: state.revision, data: { name: 'Hijack' } }), error => error.code === 'FORBIDDEN_MUTATION')
  assert.throws(() => assertAgentMutation(state, 'session-1', { action: 'upsert', entity: 'bindings', expectedRevision: state.revision, data: { sessionId: 'x' } }), error => error.code === 'FORBIDDEN_MUTATION')
  assert.throws(() => assertAgentMutation(state, 'session-1', { action: 'upsert', entity: 'tasks', expectedRevision: state.revision, data: { projectId: 'project-2', title: 'Wrong' } }), error => error.code === 'WRONG_PROJECT')
  assert.doesNotThrow(() => assertAgentMutation(state, 'session-1', { action: 'upsert', entity: 'tasks', expectedRevision: state.revision, data: { projectId: 'project-1', title: 'Allowed' } }))
})

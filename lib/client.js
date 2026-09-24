window.__ModuleLoader__.load({
  id: 'dsh-bid-workbench',
  factory: (require) => {
    const React = require('react')
    const h = React.createElement
    const NS = 'dsh-bid-workbench'
    const API = '/api/bid-workbench'

    const zh = {
      title: '投标作战室', description: '把招标要求与内部证据对齐，识别致命缺口，并形成可执行的 48 小时计划。',
      loading: '正在读取投标数据…', retry: '重试', refresh: '刷新', refreshed: '已刷新最新数据。', emptyTitle: '还没有投标项目', emptyBody: '先创建一个空白项目，或明确载入演示数据。载入示例不会修改已有项目。',
      createProject: '创建项目', sample: '载入示例项目', sampleExists: '示例项目已存在，未重复创建。', sampleLoaded: '示例项目已创建。',
      projectName: '项目名称', client: '招标方', submissionDate: '截标日期', budgetLimit: '最高限价', quotedAmount: '当前报价', create: '创建', cancel: '取消', save: '保存', archive: '归档',
      overview: '投标概览', compliance: '合规矩阵', risks: '风险清单', tasks: '48 小时行动项', analysis: '最近分析', decisions: '待决策',
      recommendation: '投标建议', progress: '硬性要求满足率', blockers: '阻断风险', budgetGap: '报价差额', noDeadline: '未设置截标日期', daysLeft: '天后截标',
      requirement: '要求', type: '类型', status: '状态', evidence: '证据', source: '来源', owner: '负责人', mitigation: '应对措施', priority: '优先级', dueDate: '截止日期', outcome: '结论',
      addRequirement: '添加要求', addRisk: '添加风险', addTask: '添加行动项', add: '添加', noItems: '暂无记录',
      connect: '连接资料并开始分析', connecting: '正在创建工作区会话…', resume: '继续会话', sessions: '项目会话', noSessions: '尚未连接会话。',
      connected: '资料已连接，开场提示已放入空白草稿；请检查后发送。', cancelled: '已取消，未创建业务绑定。', conflict: '数据已在别处更新，已重新载入。请确认后重试。',
      pendingBinding: '会话已经创建，但业务绑定尚未完成。可直接重试，无需重新选择目录。', retryBinding: '重试绑定',
      localOnly: '数据仅保存在本机 DSH 数据目录。Agent 写入会在最多 3 秒内显示。',
      GO: 'Go', CONDITIONAL_GO: 'Conditional Go', NO_GO: 'No-Go', UNASSESSED: '未评估',
      mandatory: '硬性', scored: '评分', informational: '信息', met: '满足', partial: '部分满足', unmet: '不满足', unknown: '未知',
      blocker: '阻断', high: '高', medium: '中', low: '低', open: '开放', mitigated: '已缓解', accepted: '已接受',
      critical: '紧急', todo: '未开始', doing: '进行中', done: '已完成', blocked: '受阻', pending: '待决策', decided: '已决定', parked: '暂缓',
      draft: '草拟', evaluating: '评估中', bidding: '投标中', submitted: '已提交', won: '中标', lost: '未中标',
      nameRequired: '请输入项目名称。', created: '项目已创建。', saved: '已保存。', archived: '已归档。', selectProject: '选择投标项目',
      formHint: '手工录入只保存明确事实；不确定内容请留空或标为未知。', latestAt: '分析时间', refs: '个引用',
      errorGeneric: '操作失败，请稍后重试。', ariaWorkbench: '投标作战室业务面板'
    }
    const en = {
      title: 'Bid War Room', description: 'Align tender requirements with internal evidence, expose fatal gaps, and build a 48-hour action plan.',
      loading: 'Loading bid data…', retry: 'Retry', refresh: 'Refresh', refreshed: 'Latest data loaded.', emptyTitle: 'No bid projects yet', emptyBody: 'Create a blank project or explicitly load demo data. The demo never changes existing projects.',
      createProject: 'Create project', sample: 'Load sample project', sampleExists: 'The sample already exists; nothing was changed.', sampleLoaded: 'Sample project created.',
      projectName: 'Project name', client: 'Buyer', submissionDate: 'Submission date', budgetLimit: 'Budget ceiling', quotedAmount: 'Current quote', create: 'Create', cancel: 'Cancel', save: 'Save', archive: 'Archive',
      overview: 'Bid overview', compliance: 'Compliance matrix', risks: 'Risk register', tasks: '48-hour actions', analysis: 'Latest analysis', decisions: 'Decisions',
      recommendation: 'Recommendation', progress: 'Mandatory compliance', blockers: 'Blocking risks', budgetGap: 'Quote variance', noDeadline: 'No submission date', daysLeft: 'days to submit',
      requirement: 'Requirement', type: 'Type', status: 'Status', evidence: 'Evidence', source: 'Source', owner: 'Owner', mitigation: 'Mitigation', priority: 'Priority', dueDate: 'Due', outcome: 'Outcome',
      addRequirement: 'Add requirement', addRisk: 'Add risk', addTask: 'Add action', add: 'Add', noItems: 'No records yet',
      connect: 'Connect materials and start analysis', connecting: 'Creating workspace session…', resume: 'Resume', sessions: 'Project sessions', noSessions: 'No connected sessions.',
      connected: 'Materials connected. A starter prompt was placed in the empty draft; review it before sending.', cancelled: 'Cancelled with no business binding created.', conflict: 'Data changed elsewhere. The latest version is loaded; review and retry.',
      pendingBinding: 'The session was created, but its project binding is still pending. Retry without selecting the folder again.', retryBinding: 'Retry binding',
      localOnly: 'Data stays in the local DSH data directory. Agent updates appear within three seconds.',
      GO: 'Go', CONDITIONAL_GO: 'Conditional Go', NO_GO: 'No-Go', UNASSESSED: 'Unassessed',
      mandatory: 'Mandatory', scored: 'Scored', informational: 'Info', met: 'Met', partial: 'Partial', unmet: 'Unmet', unknown: 'Unknown',
      blocker: 'Blocker', high: 'High', medium: 'Medium', low: 'Low', open: 'Open', mitigated: 'Mitigated', accepted: 'Accepted',
      critical: 'Critical', todo: 'To do', doing: 'Doing', done: 'Done', blocked: 'Blocked', pending: 'Pending', decided: 'Decided', parked: 'Parked',
      draft: 'Draft', evaluating: 'Evaluating', bidding: 'Bidding', submitted: 'Submitted', won: 'Won', lost: 'Lost',
      nameRequired: 'Enter a project name.', created: 'Project created.', saved: 'Saved.', archived: 'Archived.', selectProject: 'Select bid project',
      formHint: 'Manual entry should capture confirmed facts only; leave uncertainty blank or mark it unknown.', latestAt: 'Analyzed', refs: 'references',
      errorGeneric: 'The operation failed. Please try again.', ariaWorkbench: 'Bid War Room business panel'
    }

    const css = `
      .bidWb{height:100%;min-height:0;overflow:auto;box-sizing:border-box;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:13px/1.45 ui-sans-serif,system-ui,-apple-system,sans-serif}
      .bidWb *{box-sizing:border-box}.bidWb button,.bidWb input,.bidWb select,.bidWb textarea{font:inherit;color:inherit}.bidWb button:focus-visible,.bidWb input:focus-visible,.bidWb select:focus-visible,.bidWb textarea:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}
      .bidShell{width:100%;max-width:1120px;margin:0 auto;padding:18px}.bidTop{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px}.bidBrand{display:flex;gap:10px;align-items:center}.bidMark{width:34px;height:34px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;display:grid;place-items:center;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-state-business-primary)}.bidTop h1{font-size:18px;line-height:1.2;margin:0}.bidTop p{margin:4px 0 0;color:var(--dsw-alias-label-secondary);max-width:620px}.bidActions{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
      .bidBtn{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);padding:7px 11px;border-radius:8px;cursor:pointer;white-space:nowrap}.bidBtn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.bidBtn[data-primary=true]{border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-primary);color:var(--dsw-alias-bg-base)}.bidBtn[data-danger=true]{color:var(--dsw-alias-state-error-primary)}.bidBtn:disabled{opacity:.48;cursor:not-allowed}
      .bidSelect,.bidInput,.bidTextarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;padding:7px 9px;min-width:0}.bidSelect{max-width:260px}.bidTextarea{width:100%;min-height:70px;resize:vertical}.bidNotice{padding:9px 11px;border-radius:8px;margin:0 0 12px;background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.bidNotice[data-error=true]{color:var(--dsw-alias-state-error-primary)}
      .bidEmpty{min-height:360px;border:1px dashed var(--dsw-alias-border-l2);border-radius:14px;display:grid;place-items:center;text-align:center;padding:28px}.bidEmpty h2{margin:0 0 8px;font-size:18px}.bidEmpty p{color:var(--dsw-alias-label-secondary);max-width:460px;margin:0 0 18px}
      .bidCreate{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:12px;padding:14px;margin-bottom:14px}.bidFormGrid{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr;gap:9px}.bidField{display:flex;flex-direction:column;gap:4px;color:var(--dsw-alias-label-secondary);min-width:0}.bidField .bidInput,.bidField .bidSelect{width:100%;max-width:none;color:var(--dsw-alias-label-primary)}
      .bidHero{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:14px;padding:16px;margin-bottom:12px}.bidHeroHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.bidHero h2{font-size:20px;margin:0}.bidMeta{margin-top:4px;color:var(--dsw-alias-label-secondary)}.bidDecision{font-weight:750;letter-spacing:.02em;padding:6px 10px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2)}.bidDecision[data-value=GO]{color:var(--dsw-alias-state-success-primary)}.bidDecision[data-value=CONDITIONAL_GO]{color:var(--dsw-alias-state-warning-primary)}.bidDecision[data-value=NO_GO]{color:var(--dsw-alias-state-error-primary)}
      .bidStats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:14px}.bidStat{padding:10px;background:var(--dsw-alias-bg-module-platform);border-radius:9px;min-width:0}.bidStat span{display:block;color:var(--dsw-alias-label-tertiary);font-size:11px}.bidStat strong{display:block;margin-top:2px;font-size:16px;overflow:hidden;text-overflow:ellipsis}.bidOverviewEdit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) auto;gap:8px;margin-top:12px;align-items:end}
      .bidGrid{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(250px,.65fr);gap:12px}.bidStack{display:flex;flex-direction:column;gap:12px}.bidCard{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:12px;padding:13px;min-width:0}.bidCardHead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}.bidCard h3{font-size:14px;margin:0}.bidCount{font-size:11px;color:var(--dsw-alias-label-tertiary)}
      .bidTableWrap{overflow:auto}.bidTable{border-collapse:collapse;width:100%;min-width:600px}.bidTable th{text-align:left;color:var(--dsw-alias-label-tertiary);font-size:11px;font-weight:600;padding:6px;border-bottom:1px solid var(--dsw-alias-border-l2)}.bidTable td{vertical-align:top;padding:8px 6px;border-bottom:1px solid var(--dsw-alias-border-l1)}.bidTable tr:last-child td{border-bottom:0}.bidTitleCell{font-weight:600}.bidSub{color:var(--dsw-alias-label-secondary);font-size:11px;margin-top:3px}.bidSources{display:flex;gap:4px;flex-wrap:wrap}.bidSource{font-size:10px;padding:2px 5px;border-radius:5px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary)}
      .bidPill{display:inline-flex;padding:3px 7px;border-radius:999px;background:var(--dsw-alias-bg-module-platform);font-size:11px;white-space:nowrap}.bidPill[data-tone=bad]{color:var(--dsw-alias-state-error-primary)}.bidPill[data-tone=warn]{color:var(--dsw-alias-state-warning-primary)}.bidPill[data-tone=good]{color:var(--dsw-alias-state-success-primary)}
      .bidInline{display:grid;grid-template-columns:minmax(140px,2fr) minmax(90px,1fr) auto;gap:7px;margin-top:10px}.bidRisk{padding:9px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.bidRisk:last-of-type{border-bottom:0}.bidRiskTop{display:flex;justify-content:space-between;gap:8px}.bidRisk p,.bidAnalysis p{margin:5px 0 0;color:var(--dsw-alias-label-secondary)}.bidSession{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:7px 0;border-bottom:1px solid var(--dsw-alias-border-l1)}.bidSession:last-child{border-bottom:0}.bidSession code{font-size:10px;color:var(--dsw-alias-label-tertiary)}.bidHint{font-size:11px;color:var(--dsw-alias-label-tertiary);margin:10px 0 0}.bidLoader{min-height:300px;display:grid;place-items:center;color:var(--dsw-alias-label-secondary)}
      @media(max-width:880px){.bidGrid{grid-template-columns:1fr}.bidStats{grid-template-columns:repeat(2,1fr)}.bidFormGrid{grid-template-columns:1fr 1fr}.bidOverviewEdit{grid-template-columns:1fr 1fr}.bidTop{flex-direction:column}.bidActions{justify-content:flex-start}}
      @media(max-width:520px){.bidShell{padding:12px}.bidFormGrid,.bidOverviewEdit,.bidInline{grid-template-columns:1fr}.bidStats{grid-template-columns:1fr 1fr}}
      @media(prefers-reduced-motion:reduce){.bidWb *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `

    function request(path, data) {
      return fetch(`${API}/${path}`, data === undefined ? { headers: { accept: 'application/json' } } : { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(data) }).then(async response => {
        let result
        try { result = await response.json() } catch { result = { error: 'Invalid server response.' } }
        if (!response.ok) { const error = new Error(result.error || 'Request failed.'); error.code = result.code; error.status = response.status; throw error }
        return result
      })
    }

    function tone(value) {
      if (['unmet', 'blocker', 'critical', 'NO_GO', 'blocked'].includes(value)) return 'bad'
      if (['partial', 'high', 'CONDITIONAL_GO', 'open', 'unknown'].includes(value)) return 'warn'
      if (['met', 'done', 'GO', 'mitigated'].includes(value)) return 'good'
      return 'neutral'
    }
    function Pill({ t, value }) { return h('span', { className: 'bidPill', 'data-tone': tone(value) }, t(value) || value) }
    function Sources({ refs }) { return h('div', { className: 'bidSources' }, ...(refs || []).map((ref, index) => h('span', { className: 'bidSource', key: `${ref.path}-${index}`, title: [ref.locator, ref.note].filter(Boolean).join(' · ') }, `${ref.path}${ref.locator ? ` · ${ref.locator}` : ''}`))) }
    function Field({ label, children }) { return h('label', { className: 'bidField' }, h('span', null, label), children) }
    function Button({ children, primary, danger, ...props }) { return h('button', { type: 'button', className: 'bidBtn', 'data-primary': primary || undefined, 'data-danger': danger || undefined, ...props }, children) }
    function BidIcon({ size = 20 }) {
      return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        h('path', { d: 'M7 3.5h7l4 4v13H7z' }),
        h('path', { d: 'M14 3.5v4h4' }),
        h('path', { d: 'm9 14 2 2 4-5' }))
    }

    const sample = {
      id: 'sample-smart-park-2026', project: { name: '智慧园区数字化平台投标', client: '华东智慧园区建设中心', submissionDate: '2026-10-16', budgetLimit: 800000, quotedAmount: 860000, currency: 'CNY', recommendation: 'CONDITIONAL_GO', status: 'evaluating', summary: '示例数据：报价超限、服务覆盖、截止时间和认证有效期均有待解决的问题。' },
      requirements: [
        { id: 'sample-req-budget', title: '投标总价不高于 80 万元', kind: 'mandatory', status: 'unmet', evidence: '初版报价为 86 万元，超出最高限价 6 万元。', owner: '商务负责人', sourceRefs: [{ path: '01-招标要求.md', locator: '商务条款 3.2' }, { path: '04-初版报价.csv', locator: '总价行' }] },
        { id: 'sample-req-support', title: '提供 7×24 小时运维支持', kind: 'mandatory', status: 'partial', evidence: '现有服务说明只承诺 5×8；合作伙伴能否补足尚待确认。', owner: '交付负责人', sourceRefs: [{ path: '01-招标要求.md', locator: '服务要求 2.4' }, { path: '02-公司资质.md', locator: '售后服务' }] },
        { id: 'sample-req-cert', title: '信息安全管理体系认证在有效期内', kind: 'mandatory', status: 'unmet', evidence: '认证已于 2026-08-31 过期。', owner: '资质专员', sourceRefs: [{ path: '02-公司资质.md', locator: '认证清单第 4 项' }] }
      ],
      risks: [{ id: 'sample-risk-deadline', title: '正式截标时间与内部纪要冲突', severity: 'blocker', status: 'open', mitigation: '以招标文件 18:00 为准，修正内部计划并提前两小时完成上传。', owner: '投标经理', sourceRefs: [{ path: '01-招标要求.md', locator: '第 1.6 节：18:00' }, { path: '05-投标准备会纪要.md', locator: '行动项：24:00' }] }],
      tasks: [
        { id: 'sample-task-price', title: '将报价调整至 79 万元并完成毛利复核', owner: '商务负责人', dueDate: '2026-10-14', priority: 'critical', status: 'todo', sourceRefs: [{ path: '04-初版报价.csv', locator: '总价行' }] },
        { id: 'sample-task-support', title: '确认合作伙伴 7×24 服务承诺及证明材料', owner: '交付负责人', dueDate: '2026-10-14', priority: 'critical', status: 'todo', sourceRefs: [{ path: '01-招标要求.md', locator: '服务要求 2.4' }] },
        { id: 'sample-task-cert', title: '补充有效认证或取得招标方书面澄清', owner: '资质专员', dueDate: '2026-10-15', priority: 'critical', status: 'blocked', sourceRefs: [{ path: '02-公司资质.md', locator: '认证清单第 4 项' }] }
      ],
      analyses: [{ id: 'sample-analysis-initial', summary: '当前建议为有条件投标。报价、7×24 服务承诺、截标时间和过期认证均需在提交前解决，其中认证与截标时间属于阻断项。', recommendation: 'CONDITIONAL_GO', sourceRefs: [{ path: '01-招标要求.md' }, { path: '02-公司资质.md' }, { path: '04-初版报价.csv' }, { path: '05-投标准备会纪要.md' }] }]
    }

    function putStarterDraft(ctx, service, sessionId, project) {
      try {
        if (!service.ownsSession(sessionId)) return false
        const scoped = ctx.sessions.scope(sessionId)
        const conversation = scoped?.get('conversation')
        if (!conversation) return false
        const input = conversation.input.for(scoped)
        const snapshot = input.state.getSnapshot()
        if ((snapshot.draft || '').trim() || snapshot.occurrences?.length || (snapshot.phase && snapshot.phase !== 'plain')) return true
        input.setDraft(`这是投标作战室中「${project.name}」的项目会话。请先调用 bid_workbench_read 读取当前项目，再阅读工作区内的招标文件与内部资料，检查硬性要求、报价、时间和证据冲突。先引用来源并给出最紧急的三项问题，不要在未经我确认时修改项目数据。`)
        return true
      } catch { return false }
    }

    function WorkbenchPanel({ service, entry, hostCtx }) {
      const ctx = hostCtx
      const dictionary = (navigator.language || '').toLowerCase().startsWith('zh') ? zh : en
      const t = React.useCallback(key => dictionary[key] || key, [dictionary])
      const [state, setState] = React.useState(null)
      const [selected, setSelected] = React.useState(() => { try { return localStorage.getItem('bid-workbench-project') || '' } catch { return '' } })
      const [loading, setLoading] = React.useState(true)
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState('')
      const [notice, setNotice] = React.useState('')
      const [pendingBinding, setPendingBinding] = React.useState(null)
      const [pendingStarter, setPendingStarter] = React.useState(null)
      const [creating, setCreating] = React.useState(false)
      const [createForm, setCreateForm] = React.useState({ name: '', client: '', submissionDate: '', budgetLimit: '' })
      const [quick, setQuick] = React.useState({ requirement: '', risk: '', task: '', owner: '', dueDate: '' })
      const stateRef = React.useRef(state)
      stateRef.current = state

      const followCurrentSession = React.useCallback((next = stateRef.current) => {
        try {
          const sessionId = service.currentSession()
          if (!sessionId || !service.ownsSession(sessionId)) return
          const binding = next?.bindings.find(item => item.sessionId === sessionId && !item.archivedAt)
          if (binding) setSelected(binding.projectId)
        } catch {}
      }, [service])

      const load = React.useCallback(async (announce = false) => {
        try {
          const next = await request('state')
          setState(next); setError('')
          if (announce) setNotice(t('refreshed'))
          const sessionId = service.currentSession()
          const binding = sessionId && service.ownsSession(sessionId) ? next.bindings.find(item => item.sessionId === sessionId && !item.archivedAt) : null
          const active = next.projects.find(item => item.id === binding?.projectId && !item.archivedAt) || next.projects.find(item => item.id === selected && !item.archivedAt) || next.projects.find(item => !item.archivedAt)
          if (active && active.id !== selected) setSelected(active.id)
        } catch (cause) { setError(cause.message || t('errorGeneric')) }
        finally { setLoading(false) }
      }, [selected, service, t])

      React.useEffect(() => { void load(false) }, [])
      React.useEffect(() => {
        const poll = setInterval(() => { if (document.visibilityState === 'visible' && !busy) void load(false) }, 3000)
        const visible = () => { if (document.visibilityState === 'visible') void load(false) }
        document.addEventListener('visibilitychange', visible)
        return () => { clearInterval(poll); document.removeEventListener('visibilitychange', visible) }
      }, [busy, load])
      React.useEffect(() => {
        const sync = () => followCurrentSession()
        const sessionDispose = ctx.sessions.list.subscribe(sync)
        const workbenchDispose = service.subscribe(sync)
        sync()
        return () => { sessionDispose(); workbenchDispose() }
      }, [ctx, service, followCurrentSession])
      React.useEffect(() => {
        if (!pendingStarter) return
        let attempts = 0
        const tryDraft = () => {
          attempts += 1
          if (putStarterDraft(ctx, service, pendingStarter.sessionId, pendingStarter.project) || attempts >= 10) setPendingStarter(null)
        }
        tryDraft()
        const timer = setInterval(tryDraft, 500)
        return () => clearInterval(timer)
      }, [ctx, service, pendingStarter])
      React.useEffect(() => { try { if (selected) localStorage.setItem('bid-workbench-project', selected) } catch {} }, [selected])

      const perform = async (command, success) => {
        setBusy(true); setError(''); setNotice('')
        try {
          const next = await request('mutate', { ...command, expectedRevision: stateRef.current.revision })
          setState(next); setNotice(success || t('saved')); return next
        } catch (cause) {
          if (cause.status === 409 || cause.code === 'REVISION_CONFLICT') { await load(false); setNotice(t('conflict')) }
          else setError(cause.message || t('errorGeneric'))
          throw cause
        } finally { setBusy(false) }
      }

      const createProject = async () => {
        if (!createForm.name.trim()) { setError(t('nameRequired')); return }
        try {
          const next = await perform({ action: 'createProject', data: { name: createForm.name, client: createForm.client, ...(createForm.submissionDate ? { submissionDate: createForm.submissionDate } : {}), ...(createForm.budgetLimit ? { budgetLimit: Number(createForm.budgetLimit) } : {}), currency: 'CNY', recommendation: 'UNASSESSED', status: 'draft', summary: '' } }, t('created'))
          const project = next.projects[next.projects.length - 1]
          setSelected(project.id); setCreating(false); setCreateForm({ name: '', client: '', submissionDate: '', budgetLimit: '' })
        } catch {}
      }

      const loadSample = async () => {
        setBusy(true); setError(''); setNotice('')
        try {
          let next = stateRef.current
          let changed = false
          if (!next.projects.some(item => item.id === sample.id)) {
            next = await request('mutate', { action: 'upsert', entity: 'projects', id: sample.id, data: sample.project, expectedRevision: next.revision })
            changed = true
            stateRef.current = next
          }
          for (const entity of ['requirements', 'risks', 'tasks', 'analyses']) for (const data of sample[entity]) {
            if (next[entity].some(item => item.id === data.id)) continue
            const { id, ...record } = data
            next = await request('mutate', { action: 'upsert', entity, id, data: { ...record, projectId: sample.id }, expectedRevision: next.revision })
            changed = true
            stateRef.current = next
          }
          setState(next); setSelected(sample.id); setNotice(t(changed ? 'sampleLoaded' : 'sampleExists'))
        } catch (cause) { await load(false); setError(cause.message || t('errorGeneric')) }
        finally { setBusy(false) }
      }

      const bindBusinessSession = async (sessionId, project, retried = false) => {
        try {
          const next = await request('bind-session', { sessionId, projectId: project.id, expectedRevision: stateRef.current.revision })
          stateRef.current = next; setState(next); setSelected(project.id); setPendingBinding(null); setPendingStarter({ sessionId, project }); setNotice(t('connected'))
          return next
        } catch (cause) {
          if (cause.status === 409 && !retried) {
            const latest = await request('state')
            stateRef.current = latest; setState(latest)
            return bindBusinessSession(sessionId, project, true)
          }
          setError(cause.message || t('errorGeneric'))
          throw cause
        }
      }

      const connect = async (project) => {
        setBusy(true); setError(''); setNotice(t('connecting'))
        try {
          const sessionId = await service.newWorkspaceSession()
          if (!sessionId) { setNotice(t('cancelled')); return }
          setPendingBinding({ sessionId, projectId: project.id })
          await bindBusinessSession(sessionId, project)
        } catch (cause) { setError(cause.message || t('errorGeneric')); setNotice('') }
        finally { setBusy(false) }
      }

      const resume = async (binding, project) => {
        setBusy(true); setError(''); setNotice('')
        try {
          const sessionId = await service.ensureSession({ sessionId: binding.sessionId })
          await bindBusinessSession(sessionId, project)
        } catch (cause) { setError(cause.message || t('errorGeneric')) }
        finally { setBusy(false) }
      }

      const retryPendingBinding = async () => {
        if (!pendingBinding) return
        const project = stateRef.current.projects.find(item => item.id === pendingBinding.projectId && !item.archivedAt)
        if (!project) { setPendingBinding(null); setError('目标项目不存在或已归档。'); return }
        setBusy(true); setError(''); setNotice('')
        try { await bindBusinessSession(pendingBinding.sessionId, project) }
        catch {}
        finally { setBusy(false) }
      }

      const chooseProject = async (projectId) => {
        const project = stateRef.current.projects.find(item => item.id === projectId && !item.archivedAt)
        if (!project) return
        const binding = stateRef.current.bindings.filter(item => item.projectId === projectId && !item.archivedAt).sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt))[0]
        setBusy(true); setError(''); setNotice('')
        try {
          if (binding) {
            const sessionId = await service.ensureSession({ sessionId: binding.sessionId })
            await bindBusinessSession(sessionId, project)
          } else {
            await service.home(entry.id)
            setSelected(projectId)
          }
        } catch (cause) { setError(cause.message || t('errorGeneric')) }
        finally { setBusy(false) }
      }

      if (loading && !state) return h('div', { className: 'bidWb' }, h('div', { className: 'bidLoader', role: 'status' }, t('loading')))
      const projects = state ? state.projects.filter(item => !item.archivedAt) : []
      const project = projects.find(item => item.id === selected) || projects[0]
      const rows = (entity) => state[entity].filter(item => item.projectId === project?.id && !item.archivedAt)
      const requirements = project ? rows('requirements') : []
      const risks = project ? rows('risks') : []
      const tasks = project ? rows('tasks') : []
      const decisions = project ? rows('decisions') : []
      const analyses = project ? rows('analyses').sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []
      const bindings = project ? state.bindings.filter(item => item.projectId === project.id && !item.archivedAt).sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt)) : []
      const mandatory = requirements.filter(item => item.kind === 'mandatory')
      const compliance = mandatory.length ? Math.round(100 * mandatory.filter(item => item.status === 'met').length / mandatory.length) : 0
      const blockerCount = risks.filter(item => item.severity === 'blocker' && item.status === 'open').length
      const gap = project?.budgetLimit != null && project?.quotedAmount != null ? project.quotedAmount - project.budgetLimit : null
      const days = project?.submissionDate ? Math.ceil((Date.parse(`${project.submissionDate}T00:00:00`) - Date.now()) / 86400000) : null

      const quickAdd = async (entity) => {
        const title = quick[entity === 'requirements' ? 'requirement' : entity === 'risks' ? 'risk' : 'task'].trim()
        if (!title) return
        const data = entity === 'requirements' ? { projectId: project.id, title, kind: 'mandatory', status: 'unknown', evidence: '', owner: '', sourceRefs: [] }
          : entity === 'risks' ? { projectId: project.id, title, severity: 'medium', status: 'open', mitigation: '', owner: quick.owner, sourceRefs: [] }
          : { projectId: project.id, title, owner: quick.owner, ...(quick.dueDate ? { dueDate: quick.dueDate } : {}), priority: 'high', status: 'todo', sourceRefs: [] }
        try { await perform({ action: 'upsert', entity, data }); setQuick({ ...quick, [entity === 'requirements' ? 'requirement' : entity === 'risks' ? 'risk' : 'task']: '' }) } catch {}
      }

      const header = h('header', { className: 'bidTop' },
        h('div', { className: 'bidBrand' }, h('span', { className: 'bidMark', 'aria-hidden': true }, h(BidIcon, null)), h('div', null, h('h1', null, t('title')), h('p', null, t('description')))),
        h('div', { className: 'bidActions' },
          projects.length > 0 && h('select', { className: 'bidSelect', value: project?.id || '', 'aria-label': t('selectProject'), disabled: busy, onChange: event => { void chooseProject(event.target.value) } }, projects.map(item => h('option', { key: item.id, value: item.id }, item.name))),
          h(Button, { disabled: busy, onClick: () => void load(true) }, t('refresh')),
          h(Button, { disabled: busy, onClick: () => setCreating(value => !value) }, t('createProject')),
          h(Button, { disabled: busy, onClick: () => void loadSample() }, t('sample'))))
      const message = (error || notice) && h('p', { className: 'bidNotice', 'data-error': Boolean(error), role: error ? 'alert' : 'status', 'aria-live': 'polite' }, error || notice)
      const pendingMessage = pendingBinding && h('div', { className: 'bidNotice', role: 'status' }, t('pendingBinding'), ' ', h(Button, { disabled: busy, onClick: () => void retryPendingBinding() }, t('retryBinding')))
      const createPanel = creating && h('section', { className: 'bidCreate' },
        h('div', { className: 'bidFormGrid' },
          h(Field, { label: t('projectName') }, h('input', { className: 'bidInput', value: createForm.name, autoFocus: true, maxLength: 160, onChange: event => setCreateForm({ ...createForm, name: event.target.value }) })),
          h(Field, { label: t('client') }, h('input', { className: 'bidInput', value: createForm.client, maxLength: 160, onChange: event => setCreateForm({ ...createForm, client: event.target.value }) })),
          h(Field, { label: t('submissionDate') }, h('input', { className: 'bidInput', type: 'date', value: createForm.submissionDate, onChange: event => setCreateForm({ ...createForm, submissionDate: event.target.value }) })),
          h(Field, { label: t('budgetLimit') }, h('input', { className: 'bidInput', type: 'number', min: 0, value: createForm.budgetLimit, onChange: event => setCreateForm({ ...createForm, budgetLimit: event.target.value }) }))),
        h('div', { className: 'bidActions', style: { marginTop: 10, justifyContent: 'flex-start' } }, h(Button, { primary: true, disabled: busy, onClick: () => void createProject() }, t('create')), h(Button, { disabled: busy, onClick: () => setCreating(false) }, t('cancel'))))
      const shell = (...children) => h('section', { className: 'bidWb', 'aria-label': t('ariaWorkbench') }, h('div', { className: 'bidShell' }, header, message, pendingMessage, createPanel, ...children))
      if (!project) return shell(h('div', { className: 'bidEmpty' }, h('div', null,
        h('h2', null, t('emptyTitle')), h('p', null, t('emptyBody')),
        h('div', { className: 'bidActions', style: { justifyContent: 'center' } }, h(Button, { primary: true, disabled: busy, onClick: () => setCreating(true) }, t('createProject')), h(Button, { disabled: busy, onClick: () => void loadSample() }, t('sample'))))))

      const requirementRows = requirements.map(item => h('tr', { key: item.id },
        h('td', { className: 'bidTitleCell' }, item.title, item.evidence && h('div', { className: 'bidSub' }, item.evidence)),
        h('td', null, h(Pill, { t, value: item.kind })),
        h('td', null, h(Pill, { t, value: item.status })),
        h('td', null, h(Sources, { refs: item.sourceRefs }))))
      const requirementHead = h('thead', null, h('tr', null,
        h('th', null, t('requirement')), h('th', null, t('type')), h('th', null, t('status')), h('th', null, t('source'))))
      const requirementBody = requirements.length
        ? h('div', { className: 'bidTableWrap' }, h('table', { className: 'bidTable' }, requirementHead, h('tbody', null, ...requirementRows)))
        : h('p', { className: 'bidHint' }, t('noItems'))
      const taskRows = tasks.map(item => h('tr', { key: item.id },
        h('td', { className: 'bidTitleCell' }, item.title, h('div', { className: 'bidSub' }, h(Pill, { t, value: item.priority }))),
        h('td', null, item.owner || '—'),
        h('td', null, item.dueDate || '—'),
        h('td', null, h('select', { className: 'bidSelect', value: item.status, disabled: busy, onChange: event => { void perform({ action: 'upsert', entity: 'tasks', id: item.id, data: { status: event.target.value } }).catch(() => {}) } },
          ['todo', 'doing', 'done', 'blocked'].map(value => h('option', { key: value, value }, t(value)))))))
      const taskHead = h('thead', null, h('tr', null,
        h('th', null, t('requirement')), h('th', null, t('owner')), h('th', null, t('dueDate')), h('th', null, t('status'))))
      const taskBody = tasks.length
        ? h('div', { className: 'bidTableWrap' }, h('table', { className: 'bidTable' }, taskHead, h('tbody', null, ...taskRows)))
        : h('p', { className: 'bidHint' }, t('noItems'))

      const hero = h('section', { className: 'bidHero' },
        h('div', { className: 'bidHeroHead' }, h('div', null, h('h2', null, project.name), h('div', { className: 'bidMeta' }, [project.client, project.submissionDate ? `${days} ${t('daysLeft')}` : t('noDeadline')].filter(Boolean).join(' · '))), h('span', { className: 'bidDecision', 'data-value': project.recommendation }, t(project.recommendation))),
        h('div', { className: 'bidStats' },
          h('div', { className: 'bidStat' }, h('span', null, t('progress')), h('strong', null, `${compliance}%`)),
          h('div', { className: 'bidStat' }, h('span', null, t('blockers')), h('strong', null, blockerCount)),
          h('div', { className: 'bidStat' }, h('span', null, t('budgetLimit')), h('strong', null, project.budgetLimit == null ? '—' : `${project.currency} ${project.budgetLimit.toLocaleString()}`)),
          h('div', { className: 'bidStat' }, h('span', null, t('budgetGap')), h('strong', null, gap == null ? '—' : `${gap > 0 ? '+' : ''}${gap.toLocaleString()}`))),
        h(ProjectEditor, { React, h, t, project, busy, onSave: data => perform({ action: 'upsert', entity: 'projects', id: project.id, data }) }))
      const complianceCard = h('section', { className: 'bidCard' },
        h('div', { className: 'bidCardHead' }, h('h3', null, t('compliance')), h('span', { className: 'bidCount' }, requirements.length)), requirementBody,
        h('div', { className: 'bidInline' }, h('input', { className: 'bidInput', placeholder: t('addRequirement'), value: quick.requirement, onChange: event => setQuick({ ...quick, requirement: event.target.value }) }), h('span'), h(Button, { disabled: busy || !quick.requirement.trim(), onClick: () => void quickAdd('requirements') }, t('add'))))
      const tasksCard = h('section', { className: 'bidCard' },
        h('div', { className: 'bidCardHead' }, h('h3', null, t('tasks')), h('span', { className: 'bidCount' }, tasks.length)), taskBody,
        h('div', { className: 'bidInline' }, h('input', { className: 'bidInput', placeholder: t('addTask'), value: quick.task, onChange: event => setQuick({ ...quick, task: event.target.value }) }), h('input', { className: 'bidInput', placeholder: t('owner'), value: quick.owner, onChange: event => setQuick({ ...quick, owner: event.target.value }) }), h(Button, { disabled: busy || !quick.task.trim(), onClick: () => void quickAdd('tasks') }, t('add'))))
      const risksCard = h('section', { className: 'bidCard' },
        h('div', { className: 'bidCardHead' }, h('h3', null, t('risks')), h('span', { className: 'bidCount' }, risks.length)),
        ...risks.map(item => h('article', { className: 'bidRisk', key: item.id }, h('div', { className: 'bidRiskTop' }, h('strong', null, item.title), h(Pill, { t, value: item.severity })), item.mitigation && h('p', null, item.mitigation), h(Sources, { refs: item.sourceRefs }))),
        !risks.length && h('p', { className: 'bidHint' }, t('noItems')),
        h('div', { className: 'bidInline' }, h('input', { className: 'bidInput', placeholder: t('addRisk'), value: quick.risk, onChange: event => setQuick({ ...quick, risk: event.target.value }) }), h('span'), h(Button, { disabled: busy || !quick.risk.trim(), onClick: () => void quickAdd('risks') }, t('add'))))
      const analysisCard = h('section', { className: 'bidCard bidAnalysis' },
        h('div', { className: 'bidCardHead' }, h('h3', null, t('analysis')), h('span', { className: 'bidCount' }, analyses.length)),
        analyses[0] ? h(React.Fragment, null, h(Pill, { t, value: analyses[0].recommendation }), h('p', null, analyses[0].summary), h(Sources, { refs: analyses[0].sourceRefs }), h('p', { className: 'bidHint' }, `${t('latestAt')} · ${new Date(analyses[0].createdAt).toLocaleString()}`)) : h('p', { className: 'bidHint' }, t('noItems')))
      const decisionsCard = h('section', { className: 'bidCard' },
        h('div', { className: 'bidCardHead' }, h('h3', null, t('decisions')), h('span', { className: 'bidCount' }, decisions.length)),
        ...decisions.map(item => h('article', { className: 'bidRisk', key: item.id }, h('div', { className: 'bidRiskTop' }, h('strong', null, item.title), h(Pill, { t, value: item.status })), item.outcome && h('p', null, item.outcome))),
        !decisions.length && h('p', { className: 'bidHint' }, t('noItems')),
        h('div', { className: 'bidCardHead', style: { marginTop: 14 } }, h('h3', null, t('sessions')), h(Button, { primary: true, disabled: busy, onClick: () => void connect(project) }, busy ? t('connecting') : t('connect'))),
        ...bindings.map(binding => h('div', { className: 'bidSession', key: binding.sessionId }, h('code', null, binding.sessionId), h(Button, { disabled: busy, onClick: () => void resume(binding, project) }, t('resume')))),
        !bindings.length && h('p', { className: 'bidHint' }, t('noSessions')), h('p', { className: 'bidHint' }, t('localOnly')))
      return shell(hero, h('div', { className: 'bidGrid' }, h('div', { className: 'bidStack' }, complianceCard, tasksCard), h('div', { className: 'bidStack' }, risksCard, analysisCard, decisionsCard)))
    }

    function ProjectEditor({ React, h, t, project, busy, onSave }) {
      const [form, setForm] = React.useState({ budgetLimit: project.budgetLimit ?? '', quotedAmount: project.quotedAmount ?? '', recommendation: project.recommendation })
      React.useEffect(() => setForm({ budgetLimit: project.budgetLimit ?? '', quotedAmount: project.quotedAmount ?? '', recommendation: project.recommendation }), [project.id, project.updatedAt])
      return h('div', { className: 'bidOverviewEdit' },
        h(Field, { label: t('budgetLimit') }, h('input', { className: 'bidInput', type: 'number', min: 0, value: form.budgetLimit, disabled: busy, onChange: event => setForm({ ...form, budgetLimit: event.target.value }) })),
        h(Field, { label: t('quotedAmount') }, h('input', { className: 'bidInput', type: 'number', min: 0, value: form.quotedAmount, disabled: busy, onChange: event => setForm({ ...form, quotedAmount: event.target.value }) })),
        h(Field, { label: t('recommendation') }, h('select', { className: 'bidSelect', value: form.recommendation, disabled: busy, onChange: event => setForm({ ...form, recommendation: event.target.value }) }, ['UNASSESSED', 'GO', 'CONDITIONAL_GO', 'NO_GO'].map(value => h('option', { value, key: value }, t(value))))),
        h(Button, { disabled: busy, onClick: () => void onSave({ ...(form.budgetLimit === '' ? {} : { budgetLimit: Number(form.budgetLimit) }), ...(form.quotedAmount === '' ? {} : { quotedAmount: Number(form.quotedAmount) }), recommendation: form.recommendation }) }, t('save')))
    }

    function activate(ctx) {
      const providerService = ctx.desktopWorkbenches
      ctx.effect(() => {
        const existing = document.querySelector('style[data-plugin-css="dsh-bid-workbench"]')
        if (existing) return () => {}
        const style = document.createElement('style')
        style.dataset.pluginCss = 'dsh-bid-workbench'
        style.textContent = css
        document.head.appendChild(style)
        return () => style.remove()
      })
      const Panel = (props) => h(WorkbenchPanel, { ...props, service: providerService, hostCtx: ctx })
      ctx.effect(() => ctx.desktopWorkbenches.register({
        title: '投标作战室',
        repository: 'https://github.com/cinderzhan/dsh-bid-workbench',
        version: '0.1.0',
        author: 'cinderzhan',
        description: '把招标要求与内部证据对齐，识别致命缺口，并形成 48 小时投标计划。',
        panelTitle: '投标作战室',
        audience: '售前、商务与投标团队',
        requirements: '业务数据可独立使用；连接资料时使用 Desktop 原生工作区与会话。',
        initialization: 'empty',
        layout: { businessSide: 'left', businessWidth: 0.6 }
      }, Panel))
    }

    function apply(ctx) {
      return ctx.inject(['desktopWorkbenches'], activate)
    }

    return { apply, inject: ['sessions'] }
  }
})

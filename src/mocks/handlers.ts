import { rest } from 'msw'
import { makeMockTenants } from './data'

let tenants = makeMockTenants(18)

export const handlers = [
  rest.get('/auth/session', (req, res, ctx)=> res(ctx.status(200), ctx.json({ user: { name:'Operator', email: 'ops@example.com' } }))),
  rest.post('/auth/session', async (req, res, ctx)=>{
    const body = await req.json()
    if(!body || !body.token) return res(ctx.status(422), ctx.json({ detail:'invalid' }))
    return res(ctx.status(201), ctx.json({ user:{ name:'Operator', email: 'ops@example.com' } }))
  }),
  rest.post('/auth/logout', (req, res, ctx)=> res(ctx.status(204))),

  rest.get('/api/tenants/', (req, res, ctx)=>{
    const search = req.url.searchParams.get('search') || ''
    const filtered = tenants.filter(t=> t.display_name.toLowerCase().includes(search.toLowerCase()) || t.slug.toLowerCase().includes(search.toLowerCase()))
    return res(ctx.delay(250), ctx.status(200), ctx.json({ items: filtered }))
  }),

  rest.post('/api/tenants/', async (req, res, ctx)=>{
    const body = await req.json()
    const newTenant = { ...body, tenant_id: crypto.randomUUID(), status: 'STARTING', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), root_user_email: body.root_user_email || 'owner@example.com' }
    tenants = [newTenant, ...tenants]
    return res(ctx.delay(700), ctx.status(202), ctx.json({ execution_id: 'exec:'+crypto.randomUUID(), tenant: newTenant }))
  }),

  rest.get('/api/tenants/:tenant_slug', (req, res, ctx)=>{
    const { tenant_slug } = req.params
    const t = tenants.find(x=> x.slug===tenant_slug)
    if(!t) return res(ctx.status(404))
    return res(ctx.status(200), ctx.json(t))
  }),

  rest.delete('/api/tenants/:tenant_slug', async (req, res, ctx)=>{
    const { tenant_slug } = req.params
    tenants = tenants.filter(x=> x.slug!==tenant_slug)
    return res(ctx.delay(300), ctx.status(202), ctx.json({ status:'offboarding' }))
  }),

  rest.post('/api/workflows/', async (req, res, ctx)=>{
    const body = await req.json()
    return res(ctx.status(202), ctx.json({ execution_arn: 'arn:aws:states:local:123:execution:'+crypto.randomUUID() }))
  }),

  rest.get('/api/workflows/', (req, res, ctx)=>{
    const tenant_slug = req.url.searchParams.get('tenant_slug') || ''
    return res(ctx.status(200), ctx.json({ executions: [{ executionArn: 'arn:exec:1', status: 'SUCCEEDED', name: 'provision' }] }))
  }),

  rest.get('/api/workflows/:execution_arn', (req, res, ctx)=>{
    return res(ctx.status(200), ctx.json({ executionArn: req.params.execution_arn, status: 'RUNNING' }))
  }),

  rest.post('/api/workflows/:execution_arn/stop', async (req, res, ctx)=>{
    return res(ctx.status(202), ctx.json({ stopped: true }))
  })
]

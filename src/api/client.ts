import axios from 'axios'
const api = axios.create({ baseURL: '/', headers: { 'Content-Type': 'application/json' } })
export const listTenants = (params?:any) => api.get('/api/tenants/', { params }).then(r=>r.data)
export const onboardTenant = (payload:any) => api.post('/api/tenants/', payload).then(r=>r.data)
export const getTenant = (tenant_slug:string) => api.get(`/api/tenants/${tenant_slug}`).then(r=>r.data)
export const offboardTenant = (tenant_slug:string, body:any) => api.delete(`/api/tenants/${tenant_slug}`, { data: body }).then(r=>r.data)
export const startWorkflow = (payload:any) => api.post('/api/workflows/', payload).then(r=>r.data)
export const listWorkflows = (params:any) => api.get('/api/workflows/', { params }).then(r=>r.data)
export default api

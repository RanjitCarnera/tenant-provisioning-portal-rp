import create from 'zustand'
type Tenant = any
interface TenantState{ tenants:Tenant[]; setTenants:(t:Tenant[])=>void }
export const useTenantStore = create<TenantState>((set)=>({ tenants:[], setTenants:(t)=>set({ tenants:t }) }))

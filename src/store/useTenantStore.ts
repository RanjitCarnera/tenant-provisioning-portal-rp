// import create from 'zustand''
import { create } from 'zustand'

type Tenant = any
interface TenantState{ tenants:Tenant[]; setTenants:(t:Tenant[])=>void; addTenant:(t:Tenant)=>void; addWorkflow:(w:any)=>void; workflows:any[] }
export const useTenantStore = create<TenantState>((set)=>({ tenants:[], workflows:[], setTenants:(t)=>set({ tenants:t }), addTenant:(t)=>set(state=>({ tenants:[t, ...state.tenants] })), addWorkflow:(w)=>set(state=>({ workflows:[w, ...state.workflows] })) }))

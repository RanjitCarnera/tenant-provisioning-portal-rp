import React, { useMemo, useState } from 'react'
import { Card, CardContent, Box, Stepper, Step, StepLabel, Button } from '@mui/material'
import StepProfile from './steps/StepProfile'
import StepRegionIsolation from './steps/StepRegionIsolation'
import StepAccessAuth from './steps/StepAccessAuth'
import StepNetworking from './steps/StepNetworking'
import StepReview from './steps/StepReview'
import { onboardTenant, startWorkflow } from '../../api/client'
import { useTenantStore } from '../../store/useTenantStore'
import { toast } from 'react-toastify'

const steps = ['Profile','Region & Isolation','Access & Auth','Networking & Compliance','Review & Submit']

export default function OnboardingPage(){
  const [active, setActive] = useState(0)
  const [data, setData] = useState<any>({})
  const addTenant = useTenantStore(s=>s.addTenant)
  const addWorkflow = useTenantStore(s=>s.addWorkflow)

  const update = (patch:any)=> setData((d:any)=> ({...d, ...patch}))

  const canNext = useMemo(()=>{
    if(active===0) return (data.display_name && data.slug && /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/.test(data.slug) && !['demo','staging','api'].includes(data.slug))
    if(active===1) return (data.region && data.isolation_tier)
    if(active===2) return (data.auth_mode && data.root_user_email && data.first_name && data.last_name)
    if(active===3) return true
    return data.confirmed === true
  }, [active, data])

  const next = ()=> setActive(a=> Math.min(4, a+1))
  const back = ()=> setActive(a=> Math.max(0, a-1))

  const submit = async ()=>{
    if(data.first_name) data.first_name = data.first_name.trim().replace(/\b\w/g, c=>c.toUpperCase())
    if(data.last_name) data.last_name = data.last_name.trim().replace(/\b\w/g, c=>c.toUpperCase())

    try{
      const res = await onboardTenant(data)
      const wf = await startWorkflow({ tenant_slug: data.slug, operator: data.root_user_email })
      const tenant = res.tenant || res
      tenant.status = 'STARTING'
      addTenant(tenant)
      addWorkflow({ executionArn: wf.execution_arn || ('arn:local:'+Date.now()), status: 'RUNNING', tenant_slug: data.slug, operator: data.root_user_email, started_at: new Date().toISOString() })
      toast.success('Tenant provisioning started')
      window.location.href = '/tenants'
    }catch(e){
      console.error(e)
      toast.error('Failed to start provisioning')
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ width:'100%' }}>
          <Stepper activeStep={active} alternativeLabel>
            {steps.map(s=> <Step key={s}><StepLabel>{s}</StepLabel></Step>)}
          </Stepper>

          <Box sx={{ mt:3 }}>
            {active===0 && <StepProfile data={data} onChange={update} />}
            {active===1 && <StepRegionIsolation data={data} onChange={update} />}
            {active===2 && <StepAccessAuth data={data} onChange={update} />}
            {active===3 && <StepNetworking data={data} onChange={update} />}
            {active===4 && <StepReview data={data} onChange={update} />}
          </Box>

          <Box sx={{ display:'flex', gap:2, justifyContent:'flex-end', mt:3 }}>
            {active>0 && <Button variant="outlined" onClick={back}>Back</Button>}
            {active<4 && <Button variant="contained" onClick={next} disabled={!canNext}>Next</Button>}
            {active===4 && <Button variant="contained" onClick={submit} disabled={!canNext}>Submit</Button>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

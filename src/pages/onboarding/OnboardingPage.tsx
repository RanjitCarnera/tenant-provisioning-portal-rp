import React, { useState } from 'react'
import { onboardTenant } from '../../api/client'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'

export default function OnboardingPage(){
  const [form, setForm] = useState<any>({ region:'us-east-1', isolation_tier:'tier_a_shared', auth_mode:'PASSWORD', ip_allow_list:[] })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async ()=>{
    setLoading(true)
    try{ await onboardTenant(form); navigate('/tenants') }catch(e){ console.error(e) }
    setLoading(false)
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display:'grid', gap:2 }}>
          <TextField label="Display name" value={form.display_name||''} onChange={e=>setForm({...form, display_name:e.target.value})} />
          <TextField label="Slug" value={form.slug||''} onChange={e=>setForm({...form, slug:e.target.value})} helperText={`Preview: https://${form.slug||'<slug>'}.teamweave.io`} />

          <FormControl>
            <InputLabel>Region</InputLabel>
            <Select value={form.region} label="Region" onChange={e=>setForm({...form, region:e.target.value})}>
              <MenuItem value="us-east-1">us-east-1</MenuItem>
              <MenuItem value="ca-central-1">ca-central-1</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Isolation</InputLabel>
            <Select value={form.isolation_tier} label="Isolation" onChange={e=>setForm({...form, isolation_tier:e.target.value})}>
              <MenuItem value="tier_a_shared">Tier A - Shared</MenuItem>
              <MenuItem value="tier_b_dedicated">Tier B - Dedicated</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={submit} disabled={loading}>{loading? 'Provisioning...' : 'Submit'}</Button>
        </Box>
      </CardContent>
    </Card>
  )
}

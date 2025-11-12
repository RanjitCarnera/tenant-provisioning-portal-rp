import React from 'react'
import { Box, Typography, FormControlLabel, Checkbox } from '@mui/material'

export default function StepReview({ data, onChange }:{ data:any, onChange:(p:any)=>void }){
  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <Typography variant="h6">Profile</Typography>
      <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:6 }}>{JSON.stringify({ display_name: data.display_name, industry: data.industry, slug: data.slug }, null, 2)}</pre>

      <Typography variant="h6">Region & Isolation</Typography>
      <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:6 }}>{JSON.stringify({ region: data.region, isolation_tier: data.isolation_tier }, null, 2)}</pre>

      <Typography variant="h6">Access & Auth</Typography>
      <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:6 }}>{JSON.stringify({ auth_mode: data.auth_mode, root_user_email: data.root_user_email, first_name: data.first_name, last_name: data.last_name }, null, 2)}</pre>

      <Typography variant="h6">Networking & Compliance</Typography>
      <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:12, borderRadius:6 }}>{JSON.stringify({ ip_allow_list: data.ip_allow_list || [] }, null, 2)}</pre>

      <FormControlLabel control={<Checkbox checked={!!data.confirmed} onChange={e=>onChange({ confirmed: e.target.checked })} />} label="I confirm that the information is correct and I want to provision this tenant." />
    </Box>
  )
}

import React from 'react'
import { TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material'

export default function StepAccessAuth({ data, onChange }:{ data:any, onChange:(p:any)=>void }){
  const handleName = (k:string, v:string)=> {
    const capitalized = v.replace(/\b\w/g, c=>c.toUpperCase())
    onChange({ [k]: capitalized })
  }

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <FormControl>
        <InputLabel>Auth Mode</InputLabel>
        <Select value={data.auth_mode||'PASSWORD'} label="Auth Mode" onChange={e=>onChange({ auth_mode: e.target.value })}>
          <MenuItem value="PASSWORD">PASSWORD</MenuItem>
          <MenuItem value="SSO">SSO</MenuItem>
        </Select>
      </FormControl>

      <TextField label="Root operator email" value={data.root_user_email||''} onChange={e=>onChange({ root_user_email: e.target.value })} />
      <TextField label="First name" value={data.first_name||''} onChange={e=>handleName('first_name', e.target.value)} />
      <TextField label="Last name" value={data.last_name||''} onChange={e=>handleName('last_name', e.target.value)} />
    </Box>
  )
}

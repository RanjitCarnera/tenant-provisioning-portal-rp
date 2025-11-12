import React, { useEffect, useState } from 'react'
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import { getReference } from '../../../api/client'

const slugRegex = /^[a-z0-9](?:[a-z0-9-]{1,30}[a-z0-9])?$/
const reserved = ['demo','staging','api']

export default function StepProfile({ data, onChange }:{ data:any, onChange:(p:any)=>void }){
  const [industries, setIndustries] = useState<string[]>([])
  useEffect(()=>{ getReference('industries').then(r=> setIndustries(r.items || r)) },[])

  const [slugError, setSlugError] = useState<string|undefined>(undefined)

  const handleSlug = (v:string)=>{
    onChange({ slug: v })
    if(!slugRegex.test(v)) setSlugError('Invalid slug format')
    else if(reserved.includes(v)) setSlugError('This slug is reserved')
    else setSlugError(undefined)
  }

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <TextField label="Display name" value={data.display_name||''} onChange={e=>onChange({ display_name: e.target.value })} />
      <FormControl>
        <InputLabel>Industry</InputLabel>
        <Select value={data.industry||''} label="Industry" onChange={e=>onChange({ industry: e.target.value })}>
          {industries.map((i:any)=> <MenuItem key={i} value={i}>{i}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField label="Slug" value={data.slug||''} onChange={e=>handleSlug(e.target.value)} helperText={<span>URL preview: https://{data.slug||'<slug>'}.teamweave.io</span>} error={!!slugError} />
      {slugError && <FormHelperText error>{slugError}</FormHelperText>}
    </Box>
  )
}

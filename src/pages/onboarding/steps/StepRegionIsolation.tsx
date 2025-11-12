import React, { useEffect, useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import { getReference } from '../../../api/client'

export default function StepRegionIsolation({ data, onChange }:{ data:any, onChange:(p:any)=>void }){
  const [regions, setRegions] = useState<string[]>([])
  const [tiers, setTiers] = useState<any[]>([])
  useEffect(()=>{
    getReference('regions').then(r=> setRegions(r.items || r))
    getReference('isolation_tiers').then(r=> setTiers(r.items || r))
  },[])

  return (
    <div style={{ display:'grid', gap:12 }}>
      <FormControl>
        <InputLabel>Region</InputLabel>
        <Select value={data.region||''} label="Region" onChange={e=>onChange({ region: e.target.value })}>
          {regions.map((r:any)=> <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl component="fieldset">
        <RadioGroup value={data.isolation_tier||''} onChange={e=>onChange({ isolation_tier: e.target.value })}>
          {tiers.map((t:any)=> <FormControlLabel key={t.value} value={t.value} control={<Radio />} label={t.label} />)}
        </RadioGroup>
      </FormControl>
    </div>
  )
}

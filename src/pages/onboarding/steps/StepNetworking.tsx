import React, { useState } from 'react'
import { TextField, Button, Box, Chip } from '@mui/material'

const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]{1,2})$/

function validCIDR(s:string){
  const m = s.match(cidrRegex)
  if(!m) return false
  const parts = s.split('/')[0].split('.').map(Number)
  if(parts.some(p=> p<0 || p>255)) return false
  const mask = Number(s.split('/')[1])
  return mask>=0 && mask<=32
}

export default function StepNetworking({ data, onChange }:{ data:any, onChange:(p:any)=>void }){
  const [ip, setIp] = useState('')
  const [error, setError] = useState('')

  const list = data.ip_allow_list || []

  const add = ()=>{
    if(!validCIDR(ip)) { setError('Invalid CIDR'); return }
    onChange({ ip_allow_list: [...list, ip] })
    setIp(''); setError('')
  }

  const remove = (idx:number)=>{
    const next = list.filter((_:any,i:number)=> i!==idx)
    onChange({ ip_allow_list: next })
  }

  return (
    <Box sx={{ display:'grid', gap:2 }}>
      <Box sx={{ display:'flex', gap:2 }}>
        <TextField label="CIDR (e.g. 192.168.1.0/2)" value={ip} onChange={e=>setIp(e.target.value)} error={!!error} helperText={error} />
        <Button variant="contained" onClick={add}>Add</Button>
      </Box>
      <Box>
        {(list || []).map((ip:any,idx:number)=>(
          <Chip key={idx} label={ip} onDelete={()=>remove(idx)} sx={{ mr:1, mb:1 }} />
        ))}
      </Box>
    </Box>
  )
}

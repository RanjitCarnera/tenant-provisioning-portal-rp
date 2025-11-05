import React, { useEffect, useState } from 'react'
import { listTenants } from '../../api/client'
import { Card, CardContent, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { motion } from 'framer-motion'

export default function TenantsPage(){
  const [tenants, setTenants] = useState<any[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  const fetch = async (search='')=>{
    setLoading(true)
    try{ const res = await listTenants({ search })
      setTenants(res?.items || res?.data || [])
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  useEffect(()=>{ fetch() }, [])

  return (
    <div>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display:'flex', gap:2, alignItems:'center' }}>
          <TextField label="Search tenants" variant="outlined" size="small" value={q} onChange={e=>setQ(e.target.value)} sx={{ flex:1 }} />
          <Button variant="contained" onClick={()=>fetch(q)}>Search</Button>
        </CardContent>
      </Card>

      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Region</TableCell>
                <TableCell>Isolation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Root Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tenants.map(t=> (
                <TableRow key={t.tenant_id} component={motion.tr} initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.16 }}>
                  <TableCell>{t.display_name}</TableCell>
                  <TableCell>{t.slug}</TableCell>
                  <TableCell>{t.region}</TableCell>
                  <TableCell>{t.isolation_tier==='tier_a_shared'? 'Tier A - Shared' : 'Tier B - Dedicated'}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.root_user_email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  )
}

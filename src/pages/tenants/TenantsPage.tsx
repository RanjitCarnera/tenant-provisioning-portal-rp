import React, { useEffect, useState } from 'react'
import { listTenants } from '../../api/client'
import { Card, CardContent, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useTenantStore } from '../../store/useTenantStore'

export default function TenantsPage(){
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const tenants = useTenantStore(state=>state.tenants)
  const setTenants = useTenantStore(state=>state.setTenants)

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

      <Card sx={{ p: 2, maxHeight: 500, overflow: 'auto', borderRadius: 3, boxShadow: 3 }}>
        <TableContainer component={Paper} sx={{ maxHeight: 450 }}>
          <Table stickyHeader size="small" aria-label="tenant table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Region</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Isolation</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Root Email</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tenants.map((t) => (
                <TableRow
                  key={t.tenant_id}
                  component={motion.tr}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16 }}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                    cursor: 'pointer',
                    '& td, & th': {
                      py: 2.5, // Increase vertical padding (default is 1 or 1.5)
                      px: 2,   // Adjust horizontal padding
                    },
                  }}
                  react-hook-form
                >
                  <TableCell>{t.display_name}</TableCell>
                  <TableCell>{t.slug}</TableCell>
                  <TableCell>{t.region}</TableCell>
                  <TableCell>
                    {t.isolation_tier === 'tier_a_shared'
                      ? 'Tier A - Shared'
                      : 'Tier B - Dedicated'}
                  </TableCell>
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        backgroundColor:
                          t.status === 'ACTIVE'
                            ? 'success.light'
                            : t.status === 'STARTING'
                            ? 'warning.light'
                            : 'grey.300',
                      }}
                    >
                      {t.status}
                    </Box>
                  </TableCell>
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

import React, { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import TenantsPage from './pages/tenants/TenantsPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import { ThemeProvider } from '@mui/material/styles'
import { lightTheme, darkTheme } from './theme'
import { AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

export default function App(){
  const [mode, setMode] = useState<'light'|'dark'>(()=>{
    try{
      const saved = localStorage.getItem('theme') as 'light'|'dark'|null
      if(saved) return saved
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'
    }catch{ return 'light' }
  })

  useEffect(()=>{ try{ localStorage.setItem('theme', mode) }catch{} },[mode])
  const theme = useMemo(()=> mode==='light'? lightTheme: darkTheme, [mode])

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tenant Provisioning (MUI)
          </Typography>

          <nav>
            <Link to="/tenants" style={{ marginRight: 12 }}>Directory</Link>
            <Link to="/onboarding" style={{ marginRight: 12 }}>New Tenant</Link>
          </nav>

          <IconButton sx={{ ml: 1 }} onClick={()=>setMode(m=> m==='light'?'dark':'light')} color="inherit" aria-label="toggle-theme">
            {mode==='dark'? <Brightness7Icon/> : <Brightness4Icon/>}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/tenants" element={<TenantsPage/>} />
          <Route path="/onboarding" element={<OnboardingPage/>} />
          <Route path="/" element={<TenantsPage/>} />
        </Routes>
      </Container>
    </ThemeProvider>
  )
}

import { Routes, Route, Link } from "react-router-dom";

import { AppBar, Container, IconButton, ThemeProvider, Toolbar, Typography } from "@mui/material";
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { lightTheme, darkTheme } from './theme'

import TenantsPage from './pages/tenants/TenantsPage'
import OnboardingPage from './pages/onboarding/OnboardingPage'
import { ToastContainer } from 'react-toastify'
import { useEffect, useMemo, useState } from "react";


function App() {
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
      <AppBar
  position="static"
  color="default"
  elevation={1}
  sx={{
    backgroundColor: 'background.paper',
    alignItems: 'center', // centers inner container horizontally
  }}
>
  <Toolbar
    sx={{
      width: '100%',
      maxWidth: 1280, // fixed width (standard laptop content width)
      mx: 'auto', // center the toolbar horizontally
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      Tenant Provisioning Portal
    </Typography>

    <nav style={{ display: 'flex', alignItems: 'center' }}>
      <Link to="/tenants" style={{ marginRight: 12, textDecoration: 'none' }}>
        Directory
      </Link>
      <Link to="/onboarding" style={{ marginRight: 12, textDecoration: 'none' }}>
        New Tenant
      </Link>
    </nav>

    <IconButton
      sx={{ ml: 1 }}
      onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
      color="inherit"
      aria-label="toggle-theme"
    >
      {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  </Toolbar>
</AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/tenants" element={<TenantsPage/>} />
          <Route path="/onboarding" element={<OnboardingPage/>} />
          <Route index path="/" element={<TenantsPage/>} />
        </Routes>
      </Container>
      <ToastContainer position="top-right" />
    </ThemeProvider>
  );
}

export default App;

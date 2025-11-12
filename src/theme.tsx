import { createTheme } from '@mui/material'

export const getDesignTokens = (mode: 'light'|'dark') => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#0ea5e9' },
        }
      : {
          primary: { main: '#0ea5e9' },
        }),
  },
})

export const lightTheme = createTheme(getDesignTokens('light'))
export const darkTheme = createTheme(getDesignTokens('dark'))

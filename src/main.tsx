import React from 'react'
import ReactDOM from 'react-dom/client'

import { AppContextProvider } from './context/AppContext.tsx'

import AppRouter from './router/AppRouter.tsx'
import AuthWrapper from './AuthWrapper.tsx'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContextProvider>
      <AuthWrapper>
        <AppRouter />
      </AuthWrapper>
    </AppContextProvider>
  </React.StrictMode>,
)

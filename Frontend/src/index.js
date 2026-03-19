import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast';
import { ConversationProvider } from './context/ConversationContext'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
    <AuthProvider>
    <ConversationProvider>
    <App />
    <Toaster
  position="top-right"
  toastOptions={{
    success: {
      style: {
        background: '#6366f1',
        color: '#fff',
        borderRadius: '12px',
      },
    },
    error: {
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '12px',
      },
    },
  }}
/>
    </ConversationProvider>
    </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
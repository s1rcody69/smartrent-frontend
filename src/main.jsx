import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './app/store.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#0F172A', color: '#fff', fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#D97706', secondary: '#fff' } },
        }}
      />
      <App />
    </Provider>
  </StrictMode>,
)

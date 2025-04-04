import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast';
import { GlobalProvider } from './context/globalContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="bottom-center" reverseOrder={false} />
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </StrictMode>,
)

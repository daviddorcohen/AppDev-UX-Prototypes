import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ArrowLeftIcon from '@patternfly/react-icons/dist/esm/icons/arrow-left-icon'
import App from './App'

const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
const launcherUrl = base ? base.replace(/\/mta\/?$/, '/') : '/'

function Root() {
  return (
    <>
      {base && (
        <div style={{
          backgroundColor: '#151515',
          padding: '6px 16px',
          display: 'flex',
          alignItems: 'center',
        }}>
          <a
            href={launcherUrl}
            style={{
              color: 'white',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '14px',
            }}
          >
            <ArrowLeftIcon /> Back to all prototypes
          </a>
        </div>
      )}
      <BrowserRouter basename={base || '/'}>
        <App />
      </BrowserRouter>
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

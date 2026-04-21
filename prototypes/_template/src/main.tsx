import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ArrowLeftIcon from '@patternfly/react-icons/dist/esm/icons/arrow-left-icon'
import '@patternfly/react-core/dist/styles/base.css'
import App from './App'

const launcherUrl = '/AppDev-UX-Prototypes/'

function Root() {
  return (
    <>
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
      <BrowserRouter basename="/AppDev-UX-Prototypes/PROTOTYPE_NAME">
        <App />
      </BrowserRouter>
    </>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)

import React from 'react'
import ReactDOM from 'react-dom/client'
import '@patternfly/react-core/dist/styles/base.css'
import { App } from './App'

const style = document.createElement('style')
style.textContent = `
  .pf-v6-c-page__main-container { margin-top: 40px; }
  .prototype-card-tags .pf-v6-c-label {
    margin-inline-end: 4px;
  }
  .prototype-card-tags .pf-v6-c-label:last-child {
    margin-inline-end: 0;
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

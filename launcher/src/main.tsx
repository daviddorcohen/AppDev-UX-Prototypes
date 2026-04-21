import React from 'react'
import ReactDOM from 'react-dom/client'
import '@patternfly/react-core/dist/styles/base.css'
import { App } from './App'

const style = document.createElement('style')
style.textContent = `.pf-v6-c-page__main { padding-top: 20px; }`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

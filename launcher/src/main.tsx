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
  .product-filter-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--pf-t--global--spacer--sm);
    margin-top: var(--pf-t--global--spacer--md);
    margin-bottom: var(--pf-t--global--spacer--lg);
  }
  .product-filter-bar__label {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin: 0;
    flex: 0 0 auto;
    line-height: 1;
  }
  .product-filter-toggle-group {
    flex: 1 1 auto;
    flex-wrap: wrap;
    gap: var(--pf-t--global--spacer--xs);
    min-width: 0;
  }
  .product-filter-toggle-group .pf-v6-c-toggle-group__item {
    flex: 0 0 auto;
  }
  .product-filter-toggle-group .pf-v6-c-toggle-group__item + .pf-v6-c-toggle-group__item {
    margin-inline-start: 0;
  }
  .product-filter-toggle-group .pf-v6-c-toggle-group__item .pf-v6-c-toggle-group__button {
    border-radius: var(--pf-t--global--border--radius--control--default);
  }
  .product-filter-toggle-text {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

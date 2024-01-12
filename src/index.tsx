import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/index.scss';

import React from 'react';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement)
  .render(
    <React.StrictMode>
      <App />

    </React.StrictMode>,
  );

import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import { RbacProvider } from './rbac';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RbacProvider>
      <App />
    </RbacProvider>
  </React.StrictMode>
);
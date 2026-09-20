import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DeviceProvider } from './contexts/DeviceContext';
// Loaded last so it can size the existing layout to one screen in landscape.
import './styles/tvFit.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DeviceProvider>
      <App />
    </DeviceProvider>
  </React.StrictMode>
);

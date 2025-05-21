
import React from 'react';
import ReactDOM from 'react-dom/client';
// BrowserRouter è ora in App.jsx
// import { BrowserRouter } from 'react-router-dom'; 
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <BrowserRouter> Tolto da qui */}
      <App />
    {/* </BrowserRouter> Tolto da qui */}
  </React.StrictMode>
);

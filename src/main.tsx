import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Handle standalone browser mock if outside Telegram
if (!window.Telegram?.WebApp?.initData && !(window as any).Telegram?.WebApp?.initDataUnsafe?.user) {
  console.log('Running in standalone preview mode.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

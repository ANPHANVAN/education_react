import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Modal from 'react-modal';
import './index.css';
import App from './App.jsx';
import { setupFetchInterceptor } from './api/setupFetchInterceptor';
Modal.setAppElement('#root');
setupFetchInterceptor(); // set general /auth/login
createRoot(document.getElementById('root')).render(<App />);

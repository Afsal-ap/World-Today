import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  
import './index.css';
import App from './App.tsx';
import { store } from '../src/store/store.ts'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <App />
    </Provider>
  </StrictMode>
);
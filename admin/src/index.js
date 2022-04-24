import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import AuthProvider from './contexts/AuthProvider';
import { CookiesProvider } from "react-cookie";
import LenguageProvider from './contexts/LenguageProvider'
import RTL from './contexts/RTL'

ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
      <CookiesProvider>
        <RTL>
          <LenguageProvider>
            <App />
          </LenguageProvider>
        </RTL>
      </CookiesProvider>
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

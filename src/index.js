// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import reportWebVitals from './reportWebVitals';

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Login';

import reportWebVitals from './reportWebVitals';

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/app" element={<App />} />
     
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();

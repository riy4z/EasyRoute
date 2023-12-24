// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import LoginPage from './authentication/Screens/LoginPage';
import reportWebVitals from './reportWebVitals';
import Password from './authentication/Screens/Password';
import Recovery from './authentication/Screens/Recovery';
import Reset from './authentication/Screens/Reset';
import Register from './authentication/Screens/Register';
import "./index.css";
import { AuthorizeUser, ProtectRoute } from './authentication/middleware/auth';
import AdminRequest from  "./Screens/AdminRequest";

const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/password" element={<div><ProtectRoute><Password/></ProtectRoute></div>}/>
      <Route path="/register/:params" element={<Register />} />
      <Route path="/recovery" element={<Recovery/>}/>
      <Route path="/reset" element={<Reset/>}/>
      <Route path="/app" element={<div><AuthorizeUser><App /></AuthorizeUser></div>} />
      <Route path="/adminrequest" element={<AdminRequest/>}/>
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();

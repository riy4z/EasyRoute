import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import App from './App';
// import LoginPage from './authentication/Screens/LoginPage';
import LoginPasswordPage from './authentication/Screens/LoginPasswordPage';
import reportWebVitals from './reportWebVitals';
import RecoveryPage from './authentication/Screens/RecoveryPage';
import ResetPage from './authentication/Screens/ResetPage';
import Register from './authentication/Screens/Register';
import "./index.css";
import { AuthorizeUser, ProtectRoute } from './authentication/middleware/auth';


const Root = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPasswordPage/>}/>
      <Route path="/recoverypage" element={<RecoveryPage/>}/>
      <Route path="/register/:params" element={<Register/>}/>
      <Route path="/resetpage" element={<ResetPage/>}/>
      <Route path="/app" element={<AuthorizeUser><App/></AuthorizeUser>} />
    </Routes>
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();
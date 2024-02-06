import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import App from './App';
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
      <Route path="/" element={<LoginPage />} />
      <Route path="/recoverypage" element={<RecoveryPage />} />
      <Route path="/register/:params" element={<Register />} />
      <Route path="/resetpage" element={<ResetPage />} />
      <Route path="/app" element={<ProtectedApp />} />
    </Routes>
  </BrowserRouter>
);

const ProtectedApp = () => (
  <AuthorizeUser>
    <App />
  </AuthorizeUser>
);

const LoginPage = () => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to={'/app'} replace={true} />;
  }
  return <LoginPasswordPage />;
};

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();
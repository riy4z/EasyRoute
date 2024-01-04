// index.js
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './authentication/Screens/LoginPage';
import reportWebVitals from './reportWebVitals';
import Password from './authentication/Screens/Password';
import Recovery from './authentication/Screens/Recovery';
import Reset from './authentication/Screens/Reset';
import Register from './authentication/Screens/Register';
import "./index.css";
import { AuthorizeUser, ProtectRoute, SessionHandler } from './authentication/middleware/auth';
import AdminRequest from "./Screens/AdminRequest";
import useFetch from './authentication/hooks/fetch.hook'; // Adjust the import path

const Root = () => {
  // const [getData] = useFetch();
  // const [redirected, setRedirected] = useState(false);
  

  // // Check if the user is authenticated based on session storage
  // const isAuthenticated = () => {
  //   return getData.apiData !== undefined;
  // };

  // useEffect(() => {
  //   const checkAuthentication = () => {
  //     if (!isAuthenticated() && !redirected) {
  //       // Navigate to the login page
  //       setRedirected(true);
  //     }
  //   };

  //   checkAuthentication();
  // }, [getData.apiData, redirected]);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<div><SessionHandler/><LoginPage /></div>}
        />
        <Route
          path="/password"
          element={<div><ProtectRoute><Password/></ProtectRoute></div>}
        />
        <Route path="/register/:params" element={<Register />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="/reset" element={<Reset />} />
        <Route
          path="/app"
          element={<div><AuthorizeUser><App /></AuthorizeUser></div>}
        />
        <Route path="/adminrequest" element={<AdminRequest />} />
        {/* {redirected && <Route path="*" element={<Navigate to="/" replace />} />} */}
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));

reportWebVitals();

import React, { useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/store';

const checkAuthentication = (location, navigate) => {
  try {
    const isLoginPage = location.pathname === '/';
    const hasSessionStorage = sessionStorage.getItem('userData');

    if (hasSessionStorage == null && isLoginPage) {
      navigate('/', { replace: true });
    } else {
      navigate('/app');
    }
  } catch (error) {
    console.error('Error checking authentication:', error);
    // Handle the error, e.g., redirect to an error page
    navigate('/error', { replace: true });
  }
};

export const SessionHandler = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuthentication(location, navigate);
  }, [location, navigate]);

  // Render the children
  return <>{children}</>;
};

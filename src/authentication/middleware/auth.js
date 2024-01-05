import {useState,useEffect} from 'react';
import { Navigate, useNavigate, useLocation} from "react-router-dom";
import { useAuthStore } from "../store/store";
import useFetch from "../hooks/fetch.hook";

export const AuthorizeUser = ({children}) => {
    const token = localStorage.getItem('token')

    if(!token){
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    return children;
}

export const ProtectRoute = ({children}) => {
    const username = useAuthStore.getState().auth.username;
    if(!username){
        return <Navigate to={'/'} replace={true}></Navigate>
    }
    return children;
}

export const SessionHandler = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const checkAuthentication = () => {
        try {
          const isLoginPage = location.pathname === '/';
          const hasSessionStorage = sessionStorage.getItem('userData');
  
          if (hasSessionStorage == null && isLoginPage) {
            navigate('/', { replace: true });
          } else{
            navigate('/app')
          }
        } catch (error) {
          console.error('Error checking authentication:', error);
        }
      };
  
      checkAuthentication();
    }, [location, navigate]);
  
    // Render the children
    return <>{children}</>;
  };
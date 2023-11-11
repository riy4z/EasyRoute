import React from 'react';
import {useNavigate} from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  const buttonStyle1 = {
    top:200,
    backgroundColor: 'red',
    border: "none",
    borderRadius: 10,
    color: "white",
    padding: "10px 10px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontWeight: 600,
    position: "absolute",
    fontSize: "16px",
    cursor: "pointer",
    justifyContent:"center",
    left:"20px",
  };
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
    
  }
  return (
    <div>
      <h1 style={{color:'black'}}>Settings</h1>
      <p style={{color:'black'}}>General</p>
      <p style={{color:'black'}}>Security</p>
      <span className='text-gray-500'>Come back later? <button style={buttonStyle1} onClick={userLogout}>
        <i className="fas fa-right-from-bracket" style={{ marginRight: 10}}></i>
          Logout
        </button></span>
      
    </div>
  );
}

export default Settings;
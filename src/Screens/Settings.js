import React from 'react';
import {useNavigate} from 'react-router-dom';

function Settings() {
  const navigate = useNavigate();
  const buttonStyle1 = "cursor-pointer bg-gray-200 rounded-lg px-8 py-1 text-white font-medium absolute mt-16 left-11 text-xl text-red-700"
  // {
  //   top:200,
  //   backgroundColor: 'red',
  //   border: "none", 
  //   padding: "10px 10px",
  //   textAlign: "center",
  //   textDecoration: "none",
  //   display: "inline-block",
  //   fontWeight: 600,
  //   position: "absolute",
  //   fontSize: "16px",
  //   cursor: "pointer",
  //   justifyContent:"center",
  //   left:"20px",
  // };
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
    
  }
  return (
    <div>
      <h1 class="text-5xl font-medium text-customColor1 text-left ">Settings</h1>
      <p> <br></br></p>
      <span className='text-gray-500 '>Come back later? <button class={buttonStyle1} onClick={userLogout}>
        {/* <i className="fas fa-right-from-bracket" style={{ marginRight: 25}}></i> */}
          Logout Account
        </button></span>
      
    </div>
  );
}

export default Settings;
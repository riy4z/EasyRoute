import React from 'react';
import {useNavigate} from 'react-router-dom';
import useFetch from '../authentication/hooks/fetch.hook';

function LogoutPopup(props) {
  const navigate = useNavigate();
  const [getData, setData, clearSessionStorage] = useFetch();

  function userLogout() {
    // Clear 'token' from localStorage
    localStorage.removeItem('token');

    // Clear session storage
    clearSessionStorage();

    // Navigate to the home page or any other desired page after logout
    navigate('/');
  }

  const popupStyle = {
    position: "fixed",
    top: "35%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
    zIndex: 999, // Make sure it's on top
    background: '#394359',
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    color: 'white',
  };

  const buttonStyle1 = {
    margin: "5px",
    marginTop: '30px',
    marginLeft: "50px",
    width: "50%",
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: "white",
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonStyle2 = {
    margin: "5px",
    marginTop: '30px',
    marginLeft: "26%",
    width: "50%",
    padding: '8px 20px',
    fontSize: '16px',
    backgroundColor: "white",
    fontWeight: '600',
    color: '#394359',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "flex-end",
  };

  return (
    <div >
      <div style={popupStyle}>
        <h2 style={labelStyle}>Do you want to Logout?</h2>
       
        <div style={buttonContainerStyle}>
          <button onClick={userLogout} style={buttonStyle1}>
            Yes
          </button>
          <button onClick={props.closePopup} style={buttonStyle2}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPopup;
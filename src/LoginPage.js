// LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Import the CSS file for styling

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if the login is successful
    if (username === 'fm' && password === 'sr') {
      // Navigate to the App component
      navigate('/app');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };
 

  return (
    <div className="login-page-container">
    <h2>LOGIN</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Username:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className="action-buttons">
        <button type="submit" className="login-button">Login</button>
        <Link to="/signup">
          <button className="signup-button">Sign Up</button>
        </Link>
      </div>
    </form>
  </div>
);
};

export default LoginPage;

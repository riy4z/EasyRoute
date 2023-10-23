// SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can implement signup logic here, for example, sending data to the server
    console.log('Username: ', username);
    console.log('Password: ', password);
    console.log('Email: ', email);
    // Reset the form
    setUsername('');
    setPassword('');
    setEmail('');
    // Navigate back to the login page
    navigate('/');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={handleEmailChange} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;

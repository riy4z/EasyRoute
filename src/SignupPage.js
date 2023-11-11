// SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      alert('Password and Confirm Password do not match.');
      return;
    }

    // You can implement signup logic here, for example, sending data to the server
    console.log('First Name: ', firstName);
    console.log('Last Name: ', lastName);
    console.log('Email: ', email);
    console.log('Address: ', address);
    console.log('Role: ', role);
    console.log('Username: ', username);
    console.log('Password: ', password);
    // Reset the form
    setFirstName('');
    setLastName('');
    setEmail('');
    setAddress('');
    setRole('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    // Navigate back to the login page
    navigate('/');
  };

 
  return (
    <div className="signup-page-container">
      <h2>SIGN UP</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="half-width">
            <label>First Name:</label>
            <input type="text" value={firstName} onChange={handleFirstNameChange} />
          </div>
          <div className="half-width">
            <label>Last Name:</label>
            <input type="text" value={lastName} onChange={handleLastNameChange} />
          </div>
        </div>
        <div className="row">
          <div className="half-width">
            <label>Email:</label>
            <input type="email" value={email} onChange={handleEmailChange} />
          </div>
          <div className="half-width">
            <label>Address:</label>
            <input type="text" value={address} onChange={handleAddressChange} />
          </div>
        </div>
        <div className="row">
          <div className="half-width">
            <label>Role:</label>
            <select value={role} onChange={handleRoleChange}>
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="half-width">
            <label>Username:</label>
            <input type="text" value={username} onChange={handleUsernameChange} />
          </div>
        </div>
        <div className="row">
          <div className="half-width">
            <label>Password:</label>
            <input type="password" value={password} onChange={handlePasswordChange} />
          </div>
          <div className="half-width">
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </div>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
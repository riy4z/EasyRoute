import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import styles from '../../styles/ProfileStyle.module.css';
import toast, { Toaster } from 'react-hot-toast';
import { authenticate,generateOTP, verifyOTP } from '../helper/helper';
import { useAuthStore } from '../store/store';

export default function RecoveryPage() {
  const navigate = useNavigate();
  const [username, setUsernameLocal] = useState('');
  const setUsername = useAuthStore((state) => state.setUsername);
  const [OTP, setOTP] = useState('');

  async function handleUsernameValidation() {
    try {
      if (!username.trim()) {
        alert('Empty Username', 'Enter a valid username before validation.');
        return;
      }
      // Assuming authenticate, generateOTP, and verifyOTP functions are available
      const isValid = await authenticate(username);

      if (isValid) {
        // Username is valid, send OTP to the user's email
        await generateAndSendOTP(username);
      } else {
        // Username is not valid, show an error message
        alert('Invalid Username', 'Please enter a valid username.');
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      console.error('Error validating username:', error);
    }
  }

  async function generateAndSendOTP(username) {
    try {
      const generatedOTP = await generateOTP(username);

      if (generatedOTP) {
        // Handle success, e.g., show a success message
        alert('OTP Sent', 'OTP has been sent to your email.');
      } else {
        // Handle error, e.g., show an error message
        alert('Error', 'Could not send OTP.');
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      console.error('Error generating and sending OTP:', error);
    }
  }

  async function onSubmit() {
    try {
      const { status } = await verifyOTP({ username, code: OTP });

      if (status === 201) {
        setUsername(username);
        // Verification success, navigate to the reset screen
        navigate(`/resetpage`)
      }
    } catch (error) {
      // Handle error, e.g., show an error toast or message
      alert('Wrong OTP', 'Check your email again and enter the correct OTP.');
    }
  }

  function resendOTP() {
    generateAndSendOTP(username);
  }

  return (
    <div className="container mx-auto">
  
      <Toaster position='top-center' reverseOrder={false}></Toaster>
  
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
  
          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>Recovery</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
              Enter OTP to recover password
            </span>
          </div>
  
          <div className="form flex flex-col items-center">
        
              <label className="inputLabel">Enter your username</label>
              <input
                className={`${styles.textbox} mt-2`}
                type="text"
                value={username}
                onChange={(e) => setUsernameLocal(e.target.value)}
                placeholder="Username"
              />
         
  
         <button className={`${styles.btn} mt-2`} onClick={handleUsernameValidation}>
  <span className="buttonText">Validate Username</span>
</button>
  
           
              <label className="mt-4">
                Enter 6 digit OTP sent to your email address.
              </label>
              <input
                className={`${styles.textbox} mt-2`}
                type="text"
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                placeholder="OTP"
              />
            
  
            <button className={`${styles.btn} mt-2`} onClick={onSubmit}>
              <span className="buttonText">Recover</span>
            </button>
          </div>
  
          <div className="resendContainer text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
          </div>
        </div>
      </div>
    </div>
  )
};
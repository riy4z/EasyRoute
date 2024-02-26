import React, { useState } from 'react';
import { verifyOTP, resetPassword } from '../../authentication/helper/helper';
import { resetPasswordValidation } from '../../authentication/helper/validate';
import toast from 'react-hot-toast';

const PasswordChangePopup = ({ onCancelPasswordClick, apiData }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOTP, setPasswordOTP] = useState('');
  const [isPasswordOTPVerified, setPasswordOTPVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
//Hi

  const handleVerifyPasswordOTP = async () => {
    try {
      const verifyOTPPassword = await verifyOTP({
        username: apiData?.username,
        code: passwordOTP,
      });

      if (verifyOTPPassword.status === 201) {
        setPasswordOTPVerified(true);
      } else {
        alert("Password OTP cannot be verified");
      }
    } catch (error) {
      console.error("An error occurred while verifying Password OTP:", error);
      alert("Password OTP cannot be verified.");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      // Validate password and confirm password
      const validationErrors = await resetPasswordValidation({
        password: newPassword,
        confirm_pwd: confirmPassword,
      });
  
      // Check for validation errors
      if (Object.keys(validationErrors).length > 0) {
        // Display validation errors
        Object.values(validationErrors).forEach((error) => toast.error(error));
        return;
      }
  
      // If validation passes, proceed to update the password
      const updatedPassword = await resetPassword({
        username: apiData?.username,
        password: newPassword,
      });
  
      if (updatedPassword.status === 201) {
        toast.success('Password updated successfully');
        onCancelPasswordClick();
      } else {
        alert("Password cannot be updated");
      }
    } catch (error) {
      console.error("An error occurred while updating password:", error);
      alert("Password cannot be updated.");
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  

  const updateemail="relative mt-2 left-[16%] border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const updatepassword="relative mt-4 left-[4%] border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const inputStyle = "relative border-2 w-full py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none";
  const buttonStyle2="relative border-2 border-red-600 mt-4 left-[11%] px-[100px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <p className='text-2xl font-bold text-center'>Change Password</p>


      {!isPasswordOTPVerified && (
        <div>
          {/* Input for OTP */}
          <input
            value={passwordOTP}
            onChange={(e) => setPasswordOTP(e.target.value)}
            className={inputStyle}
            type="text"
            placeholder="Enter OTP*"
          />
          <button className={buttonStyle2} onClick={handleVerifyPasswordOTP}>
            Verify OTP
          </button>
          <button className={updateemail} onClick={onCancelPasswordClick}>
            Cancel
          </button>
        </div>
      )}

      {isPasswordOTPVerified && (
        <div>
          <div className="flex items-center">
    <p className="mt-2 mr-2">OTP Verified!</p>
    <div className="flex items-center ml-auto">
      <i
        onClick={handleTogglePassword}
        className={`relative mt-2.5 text-gray-300 cursor-pointer ${showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}`}
      ></i>
      <span className="ml-2 mt-2">{`${showPassword? 'Hide' : 'Show'}`}</span>
    </div>
  </div>
         
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputStyle}
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password*"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password*"
          />
          <p className='text-sm text-gray-600 mt-4'>Note:</p>
          <ul className="list-disc text-sm text-gray-400 mt-2 ml-6">
    <li>Password must be more than 8 characters long.</li>
    <li>Password must have at least one special character.</li>
    <li>Password must have at least one capital letter.</li>
  </ul>
          <button className={updatepassword} onClick={handleUpdatePassword}>
            Update Password
          </button>
          <button className={updateemail} onClick={onCancelPasswordClick}>
            Cancel
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PasswordChangePopup;

import React, { useState } from 'react';
import { verifyOTP, resetPassword } from '../../authentication/helper/helper';
import { resetPasswordValidation } from '../../authentication/helper/validate';
import toast from 'react-hot-toast';

const PasswordChangePopup = ({ onCancelPasswordClick, apiData }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOTP, setPasswordOTP] = useState('');
  const [isPasswordOTPVerified, setPasswordOTPVerified] = useState(false);
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
  

  const updateemail="relative mt-2 left-3 border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const updateemailcancel="relative mt-2 left-3 border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const inputStyle = "relative left-3 border-2  py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none";
  const buttonStyle2="border-2 border-red-600 mt-4 ml-3 px-[100px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">


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
          {/* Success message and update password button */}
          <p>Password OTP Verified</p>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputStyle}
            type="password"
            placeholder="New Password*"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputStyle}
            type="password"
            placeholder="Confirm Password*"
          />
          <button className={updateemail} onClick={handleUpdatePassword}>
            Update Password
          </button>
          <button className={updateemailcancel} onClick={onCancelPasswordClick}>
            Cancel
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PasswordChangePopup;

// ChangeEmailPopup.js
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { generateOTPbyEmail, verifyOTPbyEmail } from '../../authentication/helper/helper';
import api from '../../config/api';

const ChangeEmailPopup = ({ closePopup, apiData, onEmailUpdate }) => {
  const [newEmail, setNewEmail] = useState(apiData?.email);
  const [otp, setOTP] = useState('');
  const [isOTPSent, setOTPSent] = useState(false);
  const [isOTPverified, setOTPverified] = useState(false);
  const [beforesendotp, setBeforeSendOTP] = useState(true);

  const handleSendOTP = async () => {
    try {
      const otpsend = await generateOTPbyEmail(newEmail);
      if (otpsend) {
        setOTP('');
        setBeforeSendOTP(false);
        setOTPSent(true);
      } else {
        alert("OTP can't be sent!");
      }
    } catch (error) {
      console.error("An error occurred while sending OTP:", error);
      alert("OTP cannot be sent!");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const verifyotp = await verifyOTPbyEmail({ email: newEmail, code: otp });

      if (verifyotp.status === 201) {
        setOTPverified(true);
        setOTPSent(false);
        setBeforeSendOTP(false);
      } else {
        alert("Email cannot be verified");
      }
    } catch (error) {
      console.error("An error occurred while verifying OTP:", error);
      alert("Email cannot be verified.");
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const updatedUser = await api.patch(`/updateUser/${apiData?._id}`, {
        email: newEmail,
      });

      if (updatedUser.status === 200) {
        sessionStorage.setItem('userData', JSON.stringify(updatedUser.data))
        toast.success('Email updated successfully.');
        onEmailUpdate(newEmail);
        closePopup();
      } else {
        alert("Userdata cannot be updated");
      }
    } catch (error) {
      console.error("An error occurred while updating userData:", error);
      alert("UserData cannot be updated.");
    }
  };

  const onCancelClick = () => {
    setBeforeSendOTP(false);
    setOTPSent(false);
    setOTPverified(false);
    closePopup();
  };

  const inputStyle = "relative border-2 py-3 w-full rounded-xl px-4 shadow-sm text-lg mt-4 focus:outline-none";
  const buttonStyle2 = "relative border-2 border-red-600 mt-4 ml-3 px-[58px] py-2 rounded-lg text-red-600 text-xl left-[18%] text-center hover:bg-red-600 hover:text-white";
  const updateemail = "relative mt-12 left-3 left-[14%] border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white";
  const updateemailcancel = "relative mt-4 left-[15%] border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white";

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <p className='text-2xl font-bold text-center'>Change Email</p>
        {beforesendotp && (
          <div>
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={inputStyle}
              type="text"
              placeholder="Email*"
              disabled={isOTPSent}
            />
            <button className={buttonStyle2} onClick={handleSendOTP}>
              Send OTP
            </button>
            <button className={updateemailcancel} onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        )}

        {isOTPSent && (
          <div>
            <p className={inputStyle}>{newEmail}</p>
            <input
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className={inputStyle}
              type="text"
              placeholder="Enter OTP*"
            />
            <button className={buttonStyle2} onClick={handleVerifyOTP}>
              Verify OTP
            </button>
            <button className={updateemailcancel} onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        )}

        {isOTPverified && (
          <div>
            <p className={inputStyle}>{newEmail}</p>
            <button className={updateemail} onClick={handleUpdateEmail}>
              Update
            </button>
            <button className={updateemailcancel} onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeEmailPopup;

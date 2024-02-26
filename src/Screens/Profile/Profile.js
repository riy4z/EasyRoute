import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useFetch from '../../authentication/hooks/fetch.hook';
import {generateOTP} from '../../authentication/helper/helper';
import LogoutPopup from './LogoutPopup';
import ChangeEmailPopup from './ChangeEmailPopup';
import PasswordChangePopup from './PasswordChangePopup';
import api from '../../config/api';

export default function Profile() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [isEmailChanging, setEmailChanging] = useState(false);
  const [isPasswordChanging, setPasswordChanging] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [{ isLoading, apiData, serverError }] = useFetch('');
  const [originalData, setOriginalData] = useState({}); // Update the query here
  const [formData, setFormData] = useState({
    username:'',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    if (apiData) {
      setFormData({
        username: apiData?.username || '',
        firstName: apiData?.firstName || '',
        lastName: apiData?.lastName || '',
        email: apiData?.email || '',
        mobile: apiData?.mobile || '',
        address: apiData?.address || '',
      });
      setOriginalData({
        username: apiData?.username || '',
        firstName: apiData?.firstName || '',
        lastName: apiData?.lastName || '',
        email: apiData?.email || '',
        mobile: apiData?.mobile || '',
        address: apiData?.address || '',
      });
    }
  }, [apiData]);

  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  const handleSubmit = async () => {
    try {
      const updatedUser = await api.patch(`/updateUser/${apiData?._id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        address: formData.address
      });

      if (updatedUser.status === 200) {
        sessionStorage.setItem('userData', JSON.stringify(updatedUser.data))
        toast.success('Email updated successfully.');
        setEditing(false)
      } else {
        alert("Userdata cannot be updated");
      }
    } catch (error) {
      console.error("An error occurred while updating userData:", error);
      alert("UserData cannot be updated.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onEditClick = () => {
    setEditing(true);
  };

  const handleChangeEmail = () =>{
    setEmailChanging(true)
  }

  const handleCloseChangeEmail = () =>{
    setEmailChanging(false)
  }


  const onCancelClick = () => {
    setEditing(false);
    setFormData(originalData);
  };
  
  const update="absolute mt-28 ml-2 left-3 border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const inputStyle = "relative left-3 border-2  py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none";
  const buttonStyle1="border-2 border-red-600 mt-4 ml-3 px-[58px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
  const buttonStyle2="border-2 border-red-600 mt-28 ml-3 px-[100px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
  const EditStyle="border-2 border-blue-700 mt-28 ml-3 px-[112px] py-2 rounded-lg text-blue-700 text-xl text-center hover:bg-blue-700 hover:text-white"
  const EmailEditStyle="border-2 border-blue-700 mt-2 ml-3 px-16 py-2 rounded-lg text-blue-700 text-xl text-center hover:bg-blue-700 hover:text-white"
  const PasswordEditStyle="border-2 border-blue-700 mt-2 ml-3 px-12 py-2 rounded-lg text-blue-700 text-xl text-center hover:bg-blue-700 hover:text-white"

  

  if (isLoading) return <h1 className="text-2xl font-bold">Loading....</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

 

  const handleChangePassword = () => {
    try {
      const otpSend = generateOTP(apiData?.username);
      if (otpSend) {
       setPasswordChanging(true);
  } else {
    alert("Password OTP can't be sent!");
  } }catch (error) {
    console.error("An error occurred while sending Password OTP:", error);
    alert("Password OTP cannot be sent!");
  }
  }

  const onCancelPasswordClick = () => {
    setPasswordChanging(false);
  };
  


  const handleEmailUpdate = (newEmail) => {
    setNewEmail(newEmail)
    // Update the email in the state or perform any necessary actions
  };



  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="">
        <div >
          <div>
            <h4 class="text-5xl font-medium text-customColor1 text-left ">Profile</h4>
          </div>

         
         
            {isEditing && ( // Conditionally render inputs when editing 
            <div class="leading-loose">
              <div>
              <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="relative left-3 border-2 py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none"
                    type="text"
                    placeholder="First Name"
                  />
                <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="relative left-3 border-2 py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none"
                    type="text"
                    placeholder="Last Name"
                  />
              </div>
              
              <div>
              <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="relative left-3 border-2 py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none"
                    type="text"
                    placeholder="Mobile"
                  />
                
              </div>

              <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="relative left-3 border-2 py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none"
                    type="text"
                    placeholder="Address"
                  />
              <button className={update} onClick={handleSubmit}>
                Update
              </button>
              <button className={buttonStyle2} onClick={onCancelClick}>
                  Cancel
                </button>
            </div>
            )} 
            
             {!isEditing && !isEmailChanging && !isPasswordChanging && ( 
              <div  className="max-w-[280px] py-5 leading-loose overlow-hidden">
                <div className="bg-[#f9f9f9] p-4 rounded border-solid border border-[#ccc] shadow-md mb-4">    
                <p className="text-center text-3xl font-semibold">{formData.username}</p>
                <p className="text-center text-gray-500 text-base">(username)</p>
               
                <div className="flex mt-6">
        <i className="fas fa-user mr-2 text-base text-gray-500"></i>
        <p className="text-base font-regular">{formData.firstName || ''} {formData.lastName || ''}</p>
      </div>

      <div className="flex mt-6">
        <i className="fas fa-envelope mr-2 text-base text-gray-500"></i>
        <p className="text-base font-regular">{newEmail || formData.email || ''}</p>
      </div>

      <div className="flex mt-6">
        <i className="fas fa-phone mr-2 text-base text-gray-500"></i>
        <p className="text-base font-regular">{formData.mobile || ''}</p>
      </div>

      <div className="flex mt-6">
        <i className="fas fa-map-marker-alt mr-2 text-base text-gray-500"></i>
        <p className="text-base font-regular">{formData.address || ''}</p>
      </div>
            
                </div>

              <span className="underline cursor-pointer text-base" onClick={onEditClick}>
                Edit
              </span>
              <br></br>
              <span className="underline cursor-pointer text-base" onClick={handleChangeEmail}>
  Change Email
</span>
<br></br>

              <span className="underline cursor-pointer text-base" onClick={handleChangePassword}>
      Change Password
    </span>
              <div>
            <button class={buttonStyle1} onClick={openPopup}>
          Logout Account
        </button>

        {isPopupOpen && (
        <LogoutPopup closePopup={closePopup} />
      )}
      
    </div>
              </div>
            )}

{isPasswordChanging && (
        <PasswordChangePopup
          onCancelPasswordClick={onCancelPasswordClick}
          apiData={apiData}
        />
      )}
         
         {isEmailChanging && (
        <ChangeEmailPopup
          closePopup={handleCloseChangeEmail}
          apiData={apiData}
          onEmailUpdate={handleEmailUpdate}
        />
      )}

        </div>
      </div>
    </div>
    
  );
}



import React, { useState } from 'react';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import useFetch from '../../authentication/hooks/fetch.hook';
import { updateUser } from '../../authentication/helper/helper';
import { profileValidation } from '../../authentication/helper/validate';
import LogoutPopup from './LogoutPopup';

export default function Profile() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isEditing, setEditing] = useState(false); // Add this state variable

  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  const [{ isLoading, apiData, serverError }] = useFetch(''); // Update the query here

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || '',
      lastName: apiData?.lastName || '',
      email: apiData?.email || '',
      mobile: apiData?.mobile || '',
      address: apiData?.address || '',
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values);
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...!',
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not update..!</b>,
      });
    },
  });
  const onEditClick = () => {
    setEditing(true);
  };

  const onCancelClick = () => {
    setEditing(false);
  };
  const update="absolute mt-28 left-3 border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  
  const inputStyle = "relative left-3 border-2  py-3 rounded-xl px-[26px] shadow-sm text-lg mt-4 focus:outline-none";
  
  const buttonStyle1="border-2 border-red-600 mt-28 ml-3 px-[58px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
  const buttonStyle2="border-2 border-red-600 mt-28 ml-3 px-[100px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
  const EditStyle="border-2 border-blue-700 mt-28 ml-3 px-[112px] py-2 rounded-lg text-blue-700 text-xl text-center hover:bg-blue-700 hover:text-white"

  

  if (isLoading) return <h1 className="text-2xl font-bold">Loading....</h1>;
  if (serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div style={{ top: 43, position: 'absolute' }}>
        <div>
          <div>
            <h4 class="text-5xl font-medium text-customColor1 text-left  ">Profile</h4>
            {/* <span className="py-4 text-xl w-2/3 text-center text-gray-500">You can update the details.</span> */}
          </div>

          <form onSubmit={formik.handleSubmit}>
            {isEditing && ( // Conditionally render inputs when editing 
            <div class="leading-loose">
              <div>
                <input
                  {...formik.getFieldProps('firstName')}
                  className={inputStyle} 
                  type="text"
                  placeholder="FirstName"
                />
                <input
                  {...formik.getFieldProps('lastName')}
                  className={inputStyle}
                  type="text"
                  placeholder="LastName"
                />
              </div>
              
              <div>
                <input
                  {...formik.getFieldProps('mobile')}
                  className={inputStyle}
                  type="text"
                  placeholder="Mobile No."
                />
                <input
                  {...formik.getFieldProps('email')}
                  className={inputStyle}
                  type="text"
                  placeholder="Email*"
                />
              </div>

              <input
                {...formik.getFieldProps('address')}
                className={inputStyle}
                type="text"
                placeholder="Address"
              />
              <button className={update} type="submit">
                Update
              </button>
              <button className={buttonStyle2} onClick={onCancelClick}>
                  Cancel
                </button>
            </div>
            )} 
             {!isEditing && ( // Display "Edit" button when not editing
              <div  className="max-w-[280px] text-xl py-5 leading-loose overlow-hidden">
                <label>
                  <strong>First Name:</strong>
                <p >{apiData?.firstName || ''}</p></label>
                <label>
                  <strong>Last Name:</strong>
                <p>{apiData?.lastName || ''}</p></label>
                <label>
                  <strong>Email:</strong>
                <p >{apiData?.email || ''}</p></label>
                <label>
                  <strong>Mobile:</strong>
                <p>{apiData?.mobile || ''}</p></label>
                <label>
                  <strong>Address:</strong>
                <p>{apiData?.address || ''}</p></label>

              <button className={EditStyle} onClick={onEditClick}>
                Edit
              </button>
              </div>
            )}
          </form>
          <div>
            <button class={buttonStyle1} onClick={openPopup}>
          Logout Account
        </button>

        {isPopupOpen && (
        <LogoutPopup closePopup={closePopup} />
      )}
      
    </div>
        </div>
      </div>
    </div>
    
  );
}

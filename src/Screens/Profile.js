import React, { useState } from 'react';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import avatar from '../authentication/assets/avatar.png';
import useFetch from '../authentication/hooks/fetch.hook';
import { updateUser } from '../authentication/helper/helper';
import convertToBase64 from '../authentication/helper/convert';
import { profileValidation } from '../authentication/helper/validate';
import LogoutPopup from './LogoutPopup';

export default function Profile() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const openPopup = () => {
    setPopupOpen(true);
  }

  const closePopup = () => {
    setPopupOpen(false);
  }

  const [file, setFile] = useState();
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
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...!',
        success: <b>Updated Successfully...!</b>,
        error: <b>Could not update..!</b>,
      });
    },
  });
  const update="absolute mt-28 left-3 border-2 border-indigo-500 px-24 py-2 rounded-lg text-indigo-500 text-xl shadow-sm text-center hover:bg-indigo-500 hover:text-white"
  const first="relative left-3 border-2 px-5 py-3 rounded-xl px-[26px] shadow-sm text-lg  mt-8 focus:outline-none"
  const last="relative left-3 border-2 px-5 py-3 rounded-xl px-[26px] shadow-sm text-lg  mt-4 focus:outline-none"
  const mobile="relative left-3 border-2 px-5 py-3 rounded-xl px-[26px] shadow-sm text-lg  mt-4 focus:outline-none"
  const email="relative left-3 border-2 px-5 py-3 rounded-xl px-[26px] shadow-sm text-lg  mt-4 focus:outline-none"
  const address="relative left-3 border-2 px-5 py-3 rounded-xl px-[26px] shadow-sm text-lg  mt-4 focus:outline-none"
  const img="relative mt-8 left-[75px] w-32 cursor-pointer border-4 border-gray-100 rounded-full shadow-lg cursor-pointer hover:border-gray-200"
  const buttonStyle1="border-2 border-red-600 mt-28 ml-3 px-[58px] py-2 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

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
            <div>
              <label htmlFor="profile">
                <img
                  src={apiData?.profile || file || avatar}
                  className={img}
                  alt="avatar"
                />
              </label>

              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>

            <div class="leading-loose">
              <div>
                <input
                  {...formik.getFieldProps('firstName')}
                  className={first} 
                  type="text"
                  placeholder="FirstName"
                />
                <input
                  {...formik.getFieldProps('lastName')}
                  className={last}
                  type="text"
                  placeholder="LastName"
                />
              </div>
              
              <div>
                <input
                  {...formik.getFieldProps('mobile')}
                  className={mobile}
                  type="text"
                  placeholder="Mobile No."
                />
                <input
                  {...formik.getFieldProps('email')}
                  className={email}
                  type="text"
                  placeholder="Email*"
                />
              </div>

              <input
                {...formik.getFieldProps('address')}
                className={address}
                type="text"
                placeholder="Address"
              />
              <button className={update} type="submit">
                Update
              </button>
            </div>
            
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

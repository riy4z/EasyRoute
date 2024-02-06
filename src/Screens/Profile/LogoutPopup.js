import React from 'react';
import {useNavigate} from 'react-router-dom';
import useFetch from '../../authentication/hooks/fetch.hook';
import { RxCrossCircled } from 'react-icons/rx';
import toast, { Toaster } from 'react-hot-toast';

function LogoutPopup(props) {
    const navigate = useNavigate();
    const [getData, setData, clearSessionStorage] = useFetch();
    function userLogout(){
        localStorage.removeItem('token');
        clearSessionStorage();
        // Show a success toast notification
        toast.success('Logout successful');
        navigate('/')}

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}></Toaster>
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-medium text-customColor1 text-left ">Do you want to Logout?</h2>
        <hr className="my-4" />
        <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <div className="flex justify-between">
          <button onClick={userLogout} className="w-2/5 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
            Yes
          </button>
          <button onClick={props.closePopup} className="w-2/5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm">
            No
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default LogoutPopup;

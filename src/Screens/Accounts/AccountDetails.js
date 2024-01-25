import React, { useState, useEffect } from 'react';
import { RxCrossCircled } from 'react-icons/rx';
import api from '../../config/api';
import config from "../../config/config";
import axios from 'axios';
import getCompanyID from '../../components/fetch/getCompany';
import getUserID from '../../components/fetch/getUser';
import 'react-datepicker/dist/react-datepicker.css';
import CheckInPopup from './CheckInPopup';
import DatePicker from 'react-datepicker';
import { addMinutes } from 'date-fns'

const AccountDetails = ({ addressData, isExpanded, onToggleExpand,onUpdateAddress, children }) => {

  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    phone: '',
    email: '',
    lastCheckIn: '',
    followUp: '',
  });

  const [isCheckInPopupOpen, setCheckInPopupOpen] = useState(false);
  const [confirmDate, setConfirmDate] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [historyData, setHistoryData] = useState([]);

  const fetchUserDetails = async (userId) => {
    try {
      // Convert userId to string
      const userIdString = userId.toString();
  
      const response = await api.get(`/getUserById/${userIdString}`);
      return response.data; // Assuming the data contains firstName and lastName
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this information?');
  
    if (confirmed) {
      const updatedData = { ...addressData, isHidden: true };
  
      api.patch(`/update-address-data/${addressData._id}`, updatedData)
        .then(response => {
          // Handle success, update UI or show success message
          // console.log('Document marked as isHidden:', response.data);
          onToggleExpand();
          alert('Information deleted successfully.');
          // Perform additional actions as needed after successful deletion
        })
        .catch(error => {
          // Handle error
          console.error('Error deleting information:', error);
          alert('Failed to delete information.');
        });
    }
  };

  const handleCheckInClick = () => {
    setCheckInPopupOpen(true);
  };

  const closeCheckInPopup = () => {
    setCheckInPopupOpen(false);
  };

  const handleDateSelection = (selectedDate) => {
    const utcDate = addMinutes(selectedDate, selectedDate.getTimezoneOffset());
  
    setConfirmDate(true);
    setFormData({
      ...formData,
      followUp: utcDate,
    });
  };

  const handleConfirmDate = () => {
    const confirmed = window.confirm('Are you sure you want to save this follow-up date?');
    
    if (confirmed) {
      const userID  = getUserID();
      const companyID = getCompanyID();
      const dataToSave = {
        addressId: addressData.markerId,
        userID: userID,
        companyID: companyID,
        followUp: formData.followUp,
      };

      api
        .post('/saveFollowUp', dataToSave)
        .then((response) => {
          // console.log('Follow-up data saved successfully:', response.data);
          setConfirmDate(false);
        })
        .catch((error) => {
          console.error('Error saving follow-up data:', error);
          alert('Failed to save follow-up data.');
        });
    } else {
      setConfirmDate(false);
    }
  };

  useEffect(() => {
    const fetchMeetingNotesAndHistory = async () => {
  try {
    const response = await api.get(`/getMeetingNotesAndHistory?addressId=${addressData._id}`);
    const data = await response.data;

    const companyID  = getCompanyID();

    // Update historyData only after filtering
    const updatedHistoryData = await Promise.all(
      data.map(async (historyItem) => {
        if (historyItem.userID) {
          const userDetails = await fetchUserDetails(historyItem.userID);
          if (userDetails) {
            return {
              ...historyItem,
              firstName: userDetails.firstName,
              lastName: userDetails.lastName,
            };
          }
        }
        return historyItem;
      })
    );

    // Filter historyData based on companyID
    const filteredHistoryData = updatedHistoryData.filter(historyItem => historyItem.companyID === companyID);

    setHistoryData(filteredHistoryData);

    if (filteredHistoryData && filteredHistoryData.length > 0) {
      const mostRecentCheckIn = filteredHistoryData.reduce((prev, current) =>
        new Date(prev.createdAt) > new Date(current.createdAt) ? prev : current
      );

      const latestCheckInDate = new Date(mostRecentCheckIn.createdAt).toLocaleString();
      setFormData({
        ...formData,
        lastCheckIn: latestCheckInDate,
      });
    } else {
      setFormData({
        ...formData,
        lastCheckIn: '',
      });
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      followUp: '',
    }));

  } catch (error) {
    console.error('Error fetching meeting notes and history:', error);
  }
};

    
    
  
    if (!activeTab || activeTab === 'details' || activeTab === 'history') {
      fetchMeetingNotesAndHistory();
    }
  }, [addressData._id, activeTab]); 

  const handleCheckInSubmit = (meetingNotes) => {
    const  userID  = getUserID();
    const  companyID  = getCompanyID();
  
    if (!userID) {
      console.error("User ID not available. Unable to save check-in.");
      return;
    }
    if (!companyID) {
      console.error("User ID not available. Unable to save check-in.");
      return;
    }
  
    const checkInData = {
      addressId: addressData._id,
      meetingNotes: meetingNotes,
      userID: userID, 
      companyID: companyID,
    };
  
    api
      .post('/addCheckIn', checkInData)
      .then(async (response) => {
        // console.log('Check-in successful:', response.data);

        const historyResponse = await api.get(`/getMeetingNotesAndHistory?addressId=${addressData._id}`);
        const updatedHistoryData = await historyResponse.json();

        const  companyID  = getCompanyID();
        const filteredHistoryData = updatedHistoryData.filter(historyItem => historyItem.companyID === companyID);
        setHistoryData(filteredHistoryData);

        setActiveTab('history');
  
        setCheckInPopupOpen(false);
      })
      .catch((error) => {
        console.error('Error during check-in:', error);
      });
  };

  const onEditName = () => {
    const newFirstName = prompt('Enter the new first name:');
    const newLastName = prompt('Enter the new last name:');
  
    if (newFirstName !== null && newLastName !== null) {
      const updatedData = { ...addressData, 'First Name': newFirstName, 'Last Name': newLastName };
      api.patch(`/update-address-data/${addressData._id}`, updatedData)
        .then(response => {
          // console.log('Name updated successfully:', newFirstName, newLastName);
          // Perform additional actions as needed after successful update
          onUpdateAddress(updatedData);
        })
        .catch(error => {
          console.error('Error updating name:', error);
          alert('Failed to update name.');
        });
    }
  };
  
  const onEditAddress = async () => {
    const newStreetAddress = prompt('Enter the new street address:');
  
    // If the user cancels the prompt for newStreetAddress, exit the function
    if (newStreetAddress === null) {
      return;
    }
  
    const newCity = prompt('Enter the new city:');
    const newState = prompt('Enter the new state:');
    const newZIPCode = prompt('Enter the new ZIP code:');
  
    if (newCity !== null && newState !== null && newZIPCode !== null) {
      const addressToGeocode = `${newStreetAddress}, ${newCity}, ${newState} ${newZIPCode}`;
  
      try {
        // Use Axios for making the HTTP request
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: addressToGeocode,
              key: config.googleMapsApiKey,
            },
          }
        );
  
        const data = response.data;
  
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          const updatedData = {
            ...addressData,
            'Street Address': newStreetAddress,
            'City': newCity,
            'State': newState,
            'ZIP Code': newZIPCode,
            'Latitude': location.lat,
            'Longitude': location.lng,
          };
  
          api.patch(`/update-address-data/${addressData._id}`, updatedData)
            .then(response => {
              // console.log('Address updated successfully:', updatedData);
              // Perform additional actions as needed after successful update
              onUpdateAddress(updatedData);
            })
            .catch(error => {
              console.error('Error updating address:', error);
              alert('Failed to update address.');
            });
        } else {
          alert('Geocoding failed. Please check the entered address.');
        }
      } catch (error) {
        console.error('Error during geocoding:', error);
        alert('Failed to geocode address.');
      }
    }
  };
  
  
  
  
  const buttonStyle="border-2 border-red-600 mt-6 w-full py-1 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"

  const buttonStyle1 = "bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer"
  const buttonStyle2 = "bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer"

  return (
    <div className={` ${isExpanded ? 'opacity-100' : 'opacity-0'} fixed top-0 right-0 bg-white text-black w-[300px] h-full p-0 z-0 transition-opacity ease-out duration-700 `}>
      <div className='bg-customColor p-3'>
        <h3 className='text-white text-xl ml-2 flex items-center justify-between'>
          Account Details
          <RxCrossCircled
            size={30}
            onClick={onToggleExpand}
            className='cursor-pointer'
          />
        </h3>
      </div>

      <div className={`${isExpanded ? 'block' : 'hidden'}`}>
        <div className='m-4'>
          <div className='flex justify-between p-4 bg-gray-200 rounded-t-md'>
            <div
              className={`cursor-pointer ${activeTab === 'details' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </div>
            <div
              className={`cursor-pointer ${activeTab === 'history' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </div>
          </div>

          {activeTab === 'details' && (
            <>
              {/* Display account details */}
              <p style={{ fontSize: "14px" }}>
            <strong style={{fontSize:20}}> {addressData['First Name']} {addressData['Last Name']}</strong>
            <i className="fas fa-thin fa-pencil" style={{ marginRight: 25, cursor:'pointer' }}  onClick={() => onEditName(addressData._id)}/><br></br>
            {addressData['Street Address']}, {addressData['City']}, {addressData['State'] }-{addressData['ZIP Code']}</p>
            <i className="fas fa-thin fa-pencil" style={{ marginRight: 25, cursor:'pointer' }}  onClick={() => onEditAddress(addressData._id)}/><br></br>

              <div className='mt-4'>
                <label className='text-sm'>Phone:</label>
                <input
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  type='tel'
                  pattern='[0-9]{3}-[0-9]{2}-[0-9]{3}'
                  className='w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
                />
              </div>
              <div className='mt-4'>
                <label className='text-sm'>Email:</label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
                />
              </div>
              <div className='mt-4'>
                <label className='text-sm'>Last Check-in:</label>
                <input
                  type='text'
                  name='lastCheckIn'
                  value={formData.lastCheckIn}
                  onChange={handleInputChange}
                  className='w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
                />
              </div>
              <div className='mt-4'>
                <label className='text-sm'>Follow Up:</label>
                <div className='relative'>
                  <DatePicker
                    placeholderText='Select FollowUp Date'
                    selected={formData.followUp}
                    onChange={handleDateSelection}
                    className='w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
                  />
                  {confirmDate && (
                    <button className={buttonStyle} onClick={handleConfirmDate}>
                      Confirm Date
                    </button>
                  )}
                </div>
              </div>

              <div className='mt-6 space-x-4'>
                <button className="border-2 border-red-600 mt-6 w-full py-1 rounded-lg text-red-600 text-xl text-center hover:bg-red-600 hover:text-white"
                 onClick={handleDelete}>
                  Delete
                </button>
                <button
                  className="bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer"
                  onClick={() => alert('Button 1 clicked')}
                >
                  Add to Route
                </button>
                <button className="bg-blue-700 hover:bg-blue-900 rounded-lg text-white py-1 px-2 text-center font-medium text-xl cursor-pointer"
                 onClick={handleCheckInClick}>
                  Check-in
                </button>
              </div>
            </>
          )}

          {activeTab === 'history' && historyData && (
            <div className='mt-6 history-container' style={{ maxHeight: '800px', overflowY: 'scroll' }}>
              <h4 className='text-lg font-bold mb-2'>History</h4>
              {historyData.map((historyItem) => (
                <div key={historyItem._id} className='border rounded-md p-3 mb-3 bg-gray-100'>
                  
                    <p className='text-xl font-semibold'>{`${historyItem.firstName} ${historyItem.lastName}`}</p>
                  
                  <p className='text-gray-700'>{`Meeting Notes: ${historyItem.meetingNotes}`}</p>
                  <p className='text-gray-700'>{`Created At: ${new Date(historyItem.createdAt).toLocaleString()}`}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {children}
      </div>
      <CheckInPopup isOpen={isCheckInPopupOpen} onClose={closeCheckInPopup} onCheckInSubmit={handleCheckInSubmit} />
    </div>
  );
};

export default AccountDetails;
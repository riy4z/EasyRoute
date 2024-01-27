import React, { useState } from "react";
import axios from 'axios';
import api from "../../config/api";
import { RxCrossCircled } from "react-icons/rx";
import { v4 as uuidv4 } from 'uuid';
import config from "../../config/config";

const EditPopup = ({ onClose, selectedLocation, addressData, companyID, onUpdateAddress }) => {
  const [formData, setFormData] = useState({
    firstName: addressData['First Name']||"",
    lastName: addressData['Last Name']||"",
    phoneNumber: addressData['Phone']||"",
    email: addressData['Email']||"",
    address: addressData['Street Address']||"",
    city: addressData['City']||"",
    state: addressData['State']||"",
    zipcode: addressData['ZIP Code']||"",
  });

  const [isHovered, setIsHovered] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSave = async () => {
    // Assuming you have a form with input elements, you can access the values like this:
    const newFirstName = formData.firstName;
    const newLastName = formData.lastName;
    const newPhone = formData.phoneNumber;
    const newEmail = formData.email;
    const newStreetAddress = formData.address;
    const newCity = formData.city;
    const newState = formData.state;
    const newZIPCode = formData.zipcode;

    if (newFirstName !== null && newLastName !== null && newStreetAddress !== null && newCity !== null && newState !== null && newZIPCode !== null) {
      const updatedData = {
        ...addressData,
        'First Name': newFirstName,
        'Last Name': newLastName,
        'Phone': newPhone,
        'Email': newEmail,
        'Street Address': newStreetAddress,
        'City': newCity,
        'State': newState,
        'ZIP Code': newZIPCode,
      };
  
      try {
        // Use Axios for making the HTTP request
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: `${newStreetAddress}, ${newCity}, ${newState} ${newZIPCode}`,
              key: config.googleMapsApiKey,
            },
          }
        );
  
        const data = response.data;
  
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          const updatedAddressData = {
            ...updatedData,
            'Latitude': location.lat,
            'Longitude': location.lng,
          };
  
          api.patch(`/update-address-data/${addressData._id}`, updatedAddressData)
            .then(response => {
              // console.log('Address updated successfully:', updatedAddressData);
              // Perform additional actions as needed after successful update
              onUpdateAddress(updatedAddressData);
              onClose()
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
    } else {
        alert("Error updating account details")
    }
  };
  
  
  // Now you can use handleSave wherever needed, for example, in a button click event.
  
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-opacity-50 backdrop-filter backdrop-blur-md flex items-center justify-center">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-md font-sans ">
        <div className="absolute top-4 right-4 cursor-pointer text-2xl" onClick={onClose}>
          <RxCrossCircled/>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Edit Details</h2>
        <hr className="my-4" />

        <label className="block mb-1 text-gray-700 text-sm">First Name:</label>
        <input
          type="text"
          name="firstName"
          placeholder="Enter First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
 <label className="block mb-1 text-gray-700 text-sm">Last Name:</label>
        <input
          type="text"
          name="lastName"
          placeholder="Enter Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">Phone:</label>
        <input
          type="text"
          name="phoneNumber"
          placeholder="Enter Phone Number"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">Address:</label>
        <input
          type="text"
          name="address"
          placeholder="Enter Address"
          value={formData.address}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">City:</label>
        <input
          type="text"
          name="city"
          placeholder="Enter City"
          value={formData.city}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">State:</label>
        <input
          type="text"
          name="state"
          placeholder="Enter State"
          value={formData.state}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />
         <label className="block mb-1 text-gray-700 text-sm">ZIP Code:</label>
        <input
          type="text"
          name="zipcode"
          placeholder="Enter ZIP Code"
          value={formData.zipcode}
          onChange={handleInputChange}
          style={{
            padding: '8px',
            fontSize: '1rem',
            width: '100%',
            border: '1px solid #ccc',
            borderRadius: '0.375rem',
          }}
        />

        <button
          onClick={handleSave}
          className={` mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md transition duration-300 text-sm ${isHovered ? 'hover:bg-blue-800' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditPopup;

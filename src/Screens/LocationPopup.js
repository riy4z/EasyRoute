import React, { useState } from 'react';
import { RxCrossCircled } from 'react-icons/rx';

function LocationPopup(props) {
  const [location, setLocation] = useState('');

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!location.trim()) {
      alert('Please enter a location.');
      return;
    }

    alert(`Location submitted: ${location}`);
    // You can perform any necessary actions with the location value here
    // For example, you might want to send it to a server or update state
    props.closePopup();
  }

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
      <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className="absolute top-4 right-4 cursor-pointer">
          <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
            <RxCrossCircled />
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Enter Location:</h2>
        <hr className="my-4" />
        <label className="block mb-2 text-gray-700 text-sm">Location:</label>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
            placeholder="Location"
          />
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
            >
              Submit
            </button>
          
          </div>
        </form>
      </div>
    </div>
  );
}

export default LocationPopup;

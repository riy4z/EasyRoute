import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import getCompanyID from "../components/getCompany"
import { RxCrossCircled } from 'react-icons/rx';
import fetchLocations from '../components/fetchLocations';
import fetchRoles from '../components/fetchRoles';

function InvitePopup(props) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [locationsFromServer, setLocationsFromServer] = useState([]);
  const [rolesFromServer, setRolesFromServer] = useState([]);

  useEffect(() => {
    // Fetch locations from the server when the component mounts
    const fetchData = async () => {
      try {
        const locations = await fetchLocations();
        setLocationsFromServer(locations);
         // Update the state with locations
        const roles = await fetchRoles();
        setRolesFromServer(roles);
      } catch (error) {
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);

  console.log(rolesFromServer);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleInviteClick = async () => {
    if (!email || !role || !location) {
      alert('Please fill in all fields');
      return;
    }

    const companyId = getCompanyID();

    if (!companyId) {
      // Handle the case where companyId is null or undefined
      console.error('Company ID is not available');
      return;
    }
  

    const uniqueLink = generateUniqueLink(email, location, role, companyId);

    try {
      await axios.post('/api/registerMail', { userEmail: email, text: uniqueLink, subject: "Invite link for company" });
      console.log(`Invitation email sent to ${email}`);
    } catch (error) {
      console.error('Error sending invitation email:', error);
    }



    setEmail('');
    setRole('');
    setLocation('');


    props.closePopup();
  };
  // Function to generate a unique link
  const generateUniqueLink = (email,location,role,companyid) => {
    // Implement your logic to generate a unique link based on the email
    return `http://${window.location.hostname}:3000/register?email=${encodeURIComponent(email)}&location=${encodeURIComponent(location)}&role=${encodeURIComponent(role)}&companyid=${(companyid)}`;
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
    <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
      <div className="absolute top-4 right-4 cursor-pointer">
        <button onClick={props.closePopup} className="text-gray-500 hover:text-gray-700">
          <RxCrossCircled />
        </button>
      </div>
      <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>
      <hr className="my-4" />

      <label className="block mb-2 text-gray-700 text-sm">Email:</label>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
      />

      <label className="block mb-2 text-gray-700 text-sm">Role:</label>
      <select
        value={role}
        onChange={handleRoleChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
        required
      >
        <option>Select Role</option>
        {rolesFromServer.map((rol) => (
            <option key={rol.id} value={rol.RoleHierarchy}>
              {rol.Role}
            </option>
          ))}
      </select>

      <label className="block mb-2 text-gray-700 text-sm">Location:</label>
      <select
        value={location}
        onChange={handleLocationChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:border-blue-500"
        required
      >
        <option>Select Location</option>
          {locationsFromServer.map((loc) => (
            <option key={loc.id} value={loc._id}>
              {loc.Location}
            </option>
          ))}
      </select>

      <div className="flex justify-end">
        <button
          onClick={handleInviteClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
        >
          Invite
        </button>
      </div>
    </div>
  </div>
);
}

export default InvitePopup;
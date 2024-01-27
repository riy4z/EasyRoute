import React, { useState, useEffect } from 'react';
import ExtendedScreen from './ExtendedScreen';
import Account from '../../Screens/Accounts/Account'; 
import Routes from '../../Screens/Routes/Routes';
import HelpSupport from '../../Screens/HelpSupport/HelpSupport';
import Settings from '../../Screens/Settings/Settings';
import '@fortawesome/fontawesome-free/css/all.css';
import Profile from '../../Screens/Profile/Profile';
import Admin from '../../Screens/Admin/Admin';
import useFetch from '../../authentication/hooks/fetch.hook';
import FollowUp from "../../Screens/Followup/FollowUp";
import fetchUserLocations from '../fetch/fetchUserLocations';
import fetchLocations from '../fetch/fetchLocations';
import getUserID from '../fetch/getUser';


function Sidebar(props) {
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('')
  const [Locations, setLocations] = useState([]);
  const [{apiData}] = useFetch('');
  const [userLocations, setUserLocations] = useState([]);

  const { polylines, handlePolylinesUpdate, onUpdateEndLocation, onUpdateStartLocation, lassoComplete, onOptimizeClick, onCustomRouteClick, onClearClick, setParentLocation} = props

  const handleOptionClick = (option, addresses) => {
    setSelectedOption(option);
    setIsExpanded(true); // Expand the ExtendedScreen on option click
  
    // Pass the addresses to the parent component
    props.setAddresses(addresses);
  };
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
    if (!isExpanded) {
      setSelectedOption(null); 
    }
  }, [isExpanded]);
  
  const handleLassoToggle = (isActive) => {
    // Pass isActive to the parent component
    props.setLassoActivate(isActive);
  };

 


  const renderContent = () => {
    switch (selectedOption) {
      case 'Admin':
        return <Admin />;
      case 'Account':
        return <Account setAddresses={props.setAddresses} selectedLocation={selectedLocation} />;
      case 'Route':
        return <Routes 
        setAddresses={props.setAddresses} 
        setLassoActivate={handleLassoToggle} 
        onSelectedAddresses={props.onSelectedAddresses}
        polylines={polylines} 
        onUpdateStartLocation={onUpdateStartLocation}
        onUpdateEndLocation={onUpdateEndLocation}
        onOptimizeClick={onOptimizeClick}
        onCustomRouteClick={onCustomRouteClick}
        onClearClick={onClearClick}
        selectedLocation={selectedLocation}
        handlePolylinesUpdate={handlePolylinesUpdate}
        lassoComplete = {lassoComplete}/>;
      case 'HelpSupport':
        return <HelpSupport />;
      case 'Settings':
        return <Settings />;
        case 'FollowUp': // Add 'FollowUp' option
        return <FollowUp
        selectedLocation={selectedLocation}
        />;
      case 'Profile':
        return <Profile />;
      default:
        return null;
    }
  };

  const optionStyle = "p-[1.3rem] cursor-pointer hover:bg-gray-50 hover:bg-opacity-5 hover:rounded-lg text-2xl"


  const selectedOptionStyle = "p-[1.3rem] cursor-pointer bg-gray-100 bg-opacity-25 rounded-lg text-2xl"


  const isAdmin = apiData?.RoleHierarchy;
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserID();
        const userLocationsData = await fetchUserLocations(userId);
        setUserLocations(userLocationsData);
        const allLocations = await fetchLocations();
        setLocations(allLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDropdownChange=(value)=>{
     setSelectedLocation(value)
     setParentLocation(value)
     
    //  props.setSelectedLocation(value)
  }

  // Constant to determine whether to display the Admin option
  const shouldDisplayAdmin = isAdmin;
  return (
    <div
      className="fixed w-[275px] h-full z-40 p-2 bg-customColor text-blue-200 leading-loose "

    >
      <h2 className="text-white text-5xl font-bold leading-loose">EasyRoute</h2>

      <select
      className="text-white bg-customColor  rounded-lg text-xl px-12 p-3 text-center inline-flex border border-gray-100 border-opacity-25 mb-2 focus:outline-none"
      id="locationDropdown"
      onChange={(e) => handleDropdownChange(e.target.value)}
      value={selectedLocation}
    >
      <option value="" disabled className="text-gray-500 px-5 hover:bg-gray-100 p-3 text-xl bg-gray-700  inline-flex text-left">Select Location</option>
      {userLocations.map((userLocation) => {
        const location = Locations.find((loc) => loc._id === userLocation.LocationID);
        return (
          <option
            key={userLocation._id}
            value={userLocation.LocationID}
            className="text-white block  hover:bg-gray-100 text-left text-xl bg-gray-700  inline-flex items-center "
          >
            {location ? location.Location : ""}
          </option>
        );
      })}
    </select>


      {(shouldDisplayAdmin === 0 || shouldDisplayAdmin === 1) && (
        <p
          className={selectedOption === 'Admin' ? selectedOptionStyle : optionStyle}
          onClick={() => handleOptionClick('Admin')}
        >
          <i className="fas fa-solid fa-user-tie" style={{ marginRight: 25 }} />
          Admin
        </p>
      )}
      <p
        className={selectedOption === 'Account' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Account')}
      >
        <i className="fas fa-user-circle" style={{ marginRight: 25 }} />
        Account
      </p>
      <p
        className={selectedOption === 'Route' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Route')}
      >
        <i className="fas fa-map-marked-alt" style={{ marginRight: 25 }} />
        Route
      </p>
      <p
        className={selectedOption === 'FollowUp' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('FollowUp')}
      >
        <i className="fas fa-star" style={{ marginRight: 25 }} />
        Follow Up
      </p>
      <p
        className={selectedOption === 'Settings' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Settings')}
      >
        <i className="fas fa-cog" style={{ marginRight: 25 }} />
        Settings
      </p>
      <p
        className={selectedOption === 'HelpSupport' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('HelpSupport')}
      >
        <i className="fas fa-question-circle" style={{ marginRight: 25 }} />
        Help & Support
      </p>
      <p
        className={selectedOption === 'Profile' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Profile')}
      >
        <i className="fas fa-user" style={{ marginRight: 25 }} />
        Profile
      </p>
<div>
      <ExtendedScreen isExpanded={isExpanded} onToggleExpand={handleToggleExpand} >
        {renderContent()}
      </ExtendedScreen>
      </div>
    </div>
  );
}

export default Sidebar;

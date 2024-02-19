import React, { useState, useEffect } from 'react';
import ExtendedScreen from './ExtendedScreen';
import Account from '../../Screens/Accounts/Account'; 
import Routes from '../../Screens/Routes/Routes';
import HelpSupport from '../../Screens/HelpSupport/HelpSupport';
import Reports from '../../Screens/Reports/Reports';
import '@fortawesome/fontawesome-free/css/all.css';
import Profile from '../../Screens/Profile/Profile';
import Admin from '../../Screens/Admin/Admin';
import useFetch from '../../authentication/hooks/fetch.hook';
import FollowUp from "../../Screens/Followup/FollowUp";
import fetchUserLocations from '../fetch/fetchUserLocations';
import fetchLocations from '../fetch/fetchLocations';
import api from '../../config/api';


function Sidebar(props) {
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('')
  const [Locations, setLocations] = useState([]);
  const [{apiData}] = useFetch('');
  const [followUpData, setFollowUpData] = useState([]);
  const [hasFollowUpForToday, setHasFollowUpForToday] = useState(false);
  const [userLocations, setUserLocations] = useState([]);

  const { polylines, handlePolylinesUpdate, onUpdateEndLocation, onUpdateStartLocation, lassoComplete, onOptimizeClick, onCustomRouteClick, onClearClick, setParentLocation, navigateToCoordinates} = props
  const[isAdmin,setIsAdmin]=useState(2);


  console.log(selectedLocation);
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

//!---Location Dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userLocationsData = await fetchUserLocations();
        setUserLocations(userLocationsData);
        const allLocations = await fetchLocations();
        setLocations(allLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, []);
 
 
  useEffect(() => {
    try { 
 
    const admin = userLocations.find((loc) => loc.LocationID === selectedLocation);
    setIsAdmin(admin.RoleHierarchy)
    console.log(isAdmin)
    }
    catch(error)
    {console.log("Location not selected")}
  },[selectedLocation]);

  //-----!
  
  
  //!------FollowUp Data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/getFollowUpDataByLocation?locationId=${selectedLocation}`);
        const sortedFollowUpData = response.data.followUps.sort((a, b) => new Date(a.followUp) - new Date(b.followUp));
        setFollowUpData(sortedFollowUpData);
      } catch (error) {
        setHasFollowUpForToday(false)
        console.error('Error fetching follow-up data:', error);
      } 
    };

    fetchData();
  }, [selectedLocation]);

  useEffect(() => {
    console.log(followUpData)
    // Check if follow-up data matches the current date
    if (followUpData.length>0){

    const currentDate = new Date().toLocaleDateString();
    followUpData.forEach((item, index) => {
      if (new Date(item.followUp).toLocaleDateString() === currentDate) {
        console.log('Follow-up data matching current date:', followUpData[index]);
        setHasFollowUpForToday(true);
      }
      else{
        setHasFollowUpForToday(false)
      }
    });}
    else{
      setHasFollowUpForToday(false)
    }
  }, [followUpData, selectedLocation]);

  //-------!
  
  const handleLassoToggle = (isActive) => {
    // Pass isActive to the parent component
    props.setLassoActivate(isActive);
  };

 

  const renderContent = () => {
    switch (selectedOption) {
      case 'Admin':
        return <Admin 
        isCorpAdmin={isAdmin} />;
      case 'Account':
        return <Account setAddresses={props.setAddresses} selectedLocation={selectedLocation} navigateToCoordinates={navigateToCoordinates}/>;
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
      case 'Reports':
        return <Reports selectedLocation={selectedLocation} />;
        case 'FollowUp': // Add 'FollowUp' option
        return <FollowUp
        followUpData={followUpData}
        />;
      case 'Profile':
        return <Profile />;
      default:
        return null;
    }
  };

  const optionStyle = "p-[1.3rem] flex cursor-pointer hover:bg-gray-50 hover:bg-opacity-5 hover:rounded-lg text-2xl"


  const selectedOptionStyle = "p-[1.3rem] flex cursor-pointer bg-gray-100 bg-opacity-25 rounded-lg text-2xl"


  const handleDropdownChange=(value)=>{
    setSelectedLocation(value)
    setParentLocation(value)
    
 }
 



  // Constant to determine whether to display the Admin option
  const shouldDisplayAdmin = isAdmin;
  return (
    <div
      className="fixed md:w-[275px] sm:w-[90px] h-full z-40 p-2 bg-customColor text-blue-200 leading-loose "

    >
      <h2 className="hidden md:inline-block text-white text-5xl font-bold leading-loose">EasyRoute</h2>
      <h2 className='block md:hidden text-white text-4xl ml-3 font-bold leading-loose'>EZ</h2>

      <select
      className="hidden md:text-white md:bg-customColor md:rounded-lg md:text-xl md:px-12 md:p-3 md:text-center md:inline-flex md:border md;border-gray-100 md:border-opacity-25 md:mb-2 focus:outline-none"
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
          <i className="fas fa-solid fa-user-tie mt-1"  />
          <span className="md:ml-6 hidden md:inline-block">Admin</span>
        </p>
      )}
      <p
        className={selectedOption === 'Account' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Account')}
      >
        <i className="fas fa-user-circle mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Account</span>
      </p>
      <p
        className={selectedOption === 'Route' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Route')}
      >
        <i className="fas fa-map-marked-alt mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Route</span>
      </p>
      <p
        className={selectedOption === 'FollowUp' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('FollowUp')}
      >
        <i className="fa-regular fa-calendar mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Follow Up</span> {hasFollowUpForToday ? <span className="bg-red-500  justify-center rounded-full h-2 w-2 p-1 ml-1 "></span> : ""}
      </p>
      <p
        className={selectedOption === 'Reports' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Reports')}
      >
        <i className="fas fa-chart-simple mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Reports</span>
      </p>
      <p
        className={selectedOption === 'Profile' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Profile')}
      >
        <i className="fas fa-user mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Profile</span>
      </p>
      <p
        className={selectedOption === 'HelpSupport' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('HelpSupport')}
      >
        <i className="fas fa-question-circle mt-1"  />
        <span className="md:ml-6 hidden md:inline-block">Help & Support</span>
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

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
  const [isDropDownExpanded, setIsDropdownExpanded] = useState(false  );
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedLocationName, setSelectedLocationName] = useState('Select Location')
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
        console.log(apiData)
        fetchData()
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, []);
 
 
  useEffect(() => {
    try { 
 
    const admin = userLocations.find((loc) => loc.LocationID === selectedLocation);
    setIsAdmin(admin.RoleHierarchy)
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
        alert("You have a Follow-up today")
      }
      else{
        setHasFollowUpForToday(false)
      }
    });}
    else{
      setHasFollowUpForToday(false)
    }
  }, [followUpData]);

  //-------!
  
  const handleLassoToggle = (isActive) => {
    // Pass isActive to the parent component
    props.setLassoActivate(isActive);
  };

 

  const renderContent = () => {
    switch (selectedOption) {
      case 'Admin':
        return <Admin 
        isCorpAdmin={isAdmin} 
        selectedLocation={selectedLocation}/>;
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
        lassoComplete = {lassoComplete}
        navigateToCoordinates={navigateToCoordinates}/>;
      case 'HelpSupport':
        return <HelpSupport />;
      case 'Reports':
        return <Reports selectedLocation={selectedLocation} />;
        case 'FollowUp': 
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


  const handleDropdownChange=(value, key)=>{
    setSelectedLocation(value)
    setParentLocation(value)
    setSelectedLocationName(key)
    setIsDropdownExpanded(false)
    setIsExpanded(false)
    props.setAddresses([])
 }
 
 const toggleDropdown = () => {
  setIsDropdownExpanded(!isDropDownExpanded);
};


  // Constant to determine whether to display the Admin option
  const shouldDisplayAdmin = isAdmin;
  return (
    <div
      className="fixed md:w-[275px] sm:w-[90px] h-full z-40 p-2 bg-gradient-to-b from-customColor to-customColorG text-blue-200 leading-loose "

    >
      <h2 className="hidden md:inline-block text-white text-5xl font-bold leading-loose">EasyRoute</h2>
      <h2 className='block md:hidden text-white text-4xl ml-3 font-bold leading-loose'>EZ</h2>

      <div className="relative">
        <div
          className="text-white hover:bg-gray-500  bg-customColor border-[1.5px] border-gray-500 border-opacity-75 text-center rounded-lg text-xl px-2 py-2 mb-2 cursor-pointer"
          onClick={toggleDropdown}
        >
          <svg class="inline-block mr-1 mb-1 w-[1.4rem] h-[1.4rem] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path fill-rule="evenodd" d="M12 2a8 8 0 0 1 6.6 12.6l-.1.1-.6.7-5.1 6.2a1 1 0 0 1-1.6 0L6 15.3l-.3-.4-.2-.2v-.2A8 8 0 0 1 11.8 2Zm3 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd"/>
  </svg>
  <div className='hidden md:inline'>
          {selectedLocationName}
          </div>
        </div>
{userLocations.length === 0&&(
  console.log("Error Fetching User Locations, please reload")
)
}
        {isDropDownExpanded && (
          <ul className="absolute top-full left-0 z-10 bg-gray-700 w-full rounded-lg overflow-hidden">
            {userLocations.map((userLocation) => {
              const location = Locations.find((loc) => loc._id === userLocation.LocationID);
              return (
                <li
                  key={userLocation._id}
                  className="text-white hover:bg-gray-600 text-left text-xl px-5 py-1 cursor-pointer"
                  onClick={() => handleDropdownChange(userLocation.LocationID, location.Location)}
                >
                  {location ? location.Location : ""}
                </li>
              );
            })}
          </ul>
        )}
      </div>


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

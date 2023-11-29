import React, { useState, useEffect } from 'react';
import ExtendedScreen from '../components/ExtendedScreen';
import Account from './Account'; 
import Routes from './Routes';
import Tools from './Tools';
import HelpSupport from './HelpSupport';
import Settings from './Settings';
import About from './About';
import '@fortawesome/fontawesome-free/css/all.css';
import Profile from './Profile';
import Admin from './Admin';
import useFetch from '../authentication/hooks/fetch.hook';

function Sidebar(props) {
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [{apiData}] = useFetch('');

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



  const renderContent = () => {
    switch (selectedOption) {
      case 'Admin':
        return <Admin />;
      case 'Account':
        return <Account setAddresses={props.setAddresses} />;
      case 'Route':
        return <Routes />;
      case 'Tools':
        return <Tools />;
      case 'HelpSupport':
        return <HelpSupport />;
      case 'Settings':
        return <Settings />;
      case 'About':
        return <About />;
      case 'Profile':
        return <Profile />;
      default:
        return null;
    }
  };

  const optionStyle = "p-3 cursor-pointer"
  // {
  //   padding: 10,
  //   cursor: 'pointer',
  // };

  const selectedOptionStyle = "p-3 cursor-pointer bg-gray-100 bg-opacity-25 rounded-lg"
  // {
  //   padding: '10px 18px',
  //   cursor: 'pointer',
  //   backgroundColor: 'rgba(255,255,255,0.1)',
  //   borderRadius: 10,
  // };

  const isAdmin = apiData?.isAdmin || false;
  

  // Constant to determine whether to display the Admin option
  const shouldDisplayAdmin = isAdmin;
  return (
    <div
      className="fixed w-[275px] h-full z-40 p-2 bg-customColor text-blue-200 leading-loose text-2xl"
      // {{
      //   width: 275,
      //   height: '100%',
      //   backgroundColor: '#282c34',
      //   fontFamily: '',
      //   fontSize: 23,
      //   color: 'lightblue',
      //   position: 'fixed',
      //   top: 0,
      //   left: 0,
      //   padding: 10,
      //   zIndex: 1,
      // }}
    >
      <h2 className="text-white text-5xl font-bold leading-loose">EasyRoute</h2>

      {shouldDisplayAdmin && (
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
        className={selectedOption === 'Tools' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Tools')}
      >
        <i className="fas fa-tools" style={{ marginRight: 25 }} />
        Tools
      </p>
      <p
        className={selectedOption === 'HelpSupport' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('HelpSupport')}
      >
        <i className="fas fa-question-circle" style={{ marginRight: 25 }} />
        Help & Support
      </p>
      <p
        className={selectedOption === 'Settings' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Settings')}
      >
        <i className="fas fa-cog" style={{ marginRight: 25 }} />
        Settings
      </p>
      <p
        className={selectedOption === 'About' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('About')}
      >
        <i className="fas fa-info-circle" style={{ marginRight: 25 }} />
        About
      </p>
      <p
        className={selectedOption === 'Profile' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Profile')}
      >
        <i className="fas fa-user" style={{ marginRight: 25 }} />
        Profile
      </p>

      <ExtendedScreen isExpanded={isExpanded} onToggleExpand={handleToggleExpand}>
        {renderContent()}
      </ExtendedScreen>
    </div>
  );
}

export default Sidebar;

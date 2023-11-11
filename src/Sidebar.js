import React, { useState, useEffect } from 'react';
import ExtendedScreen from './ExtendedScreen';
import Account from './Screens/Account'; 
import RoutesS from './Screens/RoutesS';
import Tools from './Screens/Tools';
import HelpSupport from './Screens/HelpSupport';
import Settings from './Screens/Settings';
import About from './Screens/About';
import Admin from './Screens/Admin';
import '@fortawesome/fontawesome-free/css/all.css';


function Sidebar(props) {
  const [selectedOption, setSelectedOption] = useState(null); 
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsExpanded(true); // Expand the ExtendedScreen on option click
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
    switch (selectedOption && selectedOption.toLowerCase()) {
      case 'account':
        return <Account setAddresses={props.setAddresses} />;
      case 'route':
        return <RoutesS />;
      case 'tools':
        return <Tools />;
      case 'helpsupport':
        return <HelpSupport />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <About />;
        case 'admin':
          return <Admin />;
      default:
        return null;
    }
  };

  const optionStyle = {
    padding: 10,
    cursor: 'pointer',
  };

  const selectedOptionStyle = {
    padding: '10px 18px',
    cursor: 'pointer',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
  };

  return (
    <div
      style={{
        width: 250,
        height: '100%',
        backgroundColor: '#282c34',
        fontFamily: '',
        fontSize: 25,
        color: 'lightblue',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: 20,
        zIndex: 1,
      }}
    >
      <h2 style={{ fontSize: 40, color: 'white' }}>EasyRoute</h2>
      <p
        style={selectedOption === 'Admin' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Admin')}
      >
        <i className="fas fa-solid fa-lock" style={{ marginRight: 25 }} />
        Admin
      </p>
      <p
        style={selectedOption === 'Account' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Account')}
      >
        <i className="fas fa-user-circle" style={{ marginRight: 25 }} />
        Account
      </p>
      <p
        style={selectedOption === 'Route' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Route')}
      >
        <i className="fas fa-map-marked-alt" style={{ marginRight: 25 }} />
        Route
      </p>
      <p
        style={selectedOption === 'Tools' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Tools')}
      >
        <i className="fas fa-tools" style={{ marginRight: 25 }} />
        Tools
      </p>
      <p
        style={selectedOption === 'HelpSupport' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('HelpSupport')}
      >
        <i className="fas fa-question-circle" style={{ marginRight: 25 }} />
        Help & Support
      </p>
      <p
        style={selectedOption === 'Settings' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('Settings')}
      >
        <i className="fas fa-cog" style={{ marginRight: 25 }} />
        Settings
      </p>
      <p
        style={selectedOption === 'About' ? selectedOptionStyle : optionStyle}
        onClick={() => handleOptionClick('About')}
      >
        <i className="fas fa-info-circle" style={{ marginRight: 25 }} />
        About
      </p>

      <ExtendedScreen isExpanded={isExpanded} onToggleExpand={handleToggleExpand}>
        {renderContent()}
      </ExtendedScreen>
    </div>
  );
}

export default Sidebar;

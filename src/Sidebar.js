import React, { useState } from 'react';
import ExtendedScreen from './ExtendedScreen';
import Account from './Screens/Account';
import RoutesS from './Screens/RoutesS';
import Tools from './Screens/Tools';
import HelpSupport from './Screens/HelpSupport';
import Settings from './Screens/Settings';
import About from './Screens/About';
import '@fortawesome/fontawesome-free/css/all.css';


function Sidebar() {
  const [selectedOption, setSelectedOption] = useState('Account');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsExpanded(true); // Expand the ExtendedScreen on option click
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    switch (selectedOption.toLowerCase()) {
      case 'account':
        return <Account />;
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
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: '300px',
        height: '100%',
        backgroundColor: '#282c34',
        fontFamily: 'dubai',
        fontSize: 25,
        color: 'lightblue',
        position: 'fixed',
        top: 28.5,
        left: 0,
        padding: '20px',
        zIndex: 1,
      }}
    >
      <h2 style={{ fontSize: 40, color:'white' }}>EasyRoute</h2>
      
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Account')}
        >
          <i className="fas fa-user-circle" style={{ marginRight: '25px' }} />
          Account
        </p>
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Route')}
        >
          <i className="fas fa-map-marked-alt" style={{ marginRight: '25px' }} />
          Route
        </p>
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Tools')}
        >
          <i className="fas fa-tools" style={{ marginRight: '25px' }} />
          Tools
        </p>
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('HelpSupport')}
        >
          <i className="fas fa-question-circle" style={{ marginRight: '25px' }} />
          Help & Support
        </p>
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Settings')}
        >
          <i className="fas fa-cog" style={{ marginRight: '25px' }} />
          Settings
        </p>
        <p
          style={{ padding: 5, cursor: 'pointer' }}
          onClick={() => handleOptionClick('About')}
        >
          <i className="fas fa-info-circle" style={{ marginRight: '25px' }} />
          About
        </p>
      
      <ExtendedScreen isExpanded={isExpanded} onToggleExpand={handleToggleExpand}>
        {renderContent()}
      </ExtendedScreen>
    </div>
  );
}

export default Sidebar;

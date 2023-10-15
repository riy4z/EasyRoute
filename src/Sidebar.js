import React, { useState } from 'react';
import ExtendedScreen from './ExtendedScreen';
import Account from './Screens/Account';
import RoutesS from './Screens/RoutesS';
import Settings from './Screens/Settings';
import About from './Screens/About';

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
        width: '250px',
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
      <h2 style={{ fontSize: 40 }}>EasyRoute</h2>
      <ul>
        <p
          style={{ padding: 20, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Account')}
        >
          Account
        </p>
        <p
          style={{ padding: 20, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Route')}
        >
          Route
        </p>
        <p
          style={{ padding: 20, cursor: 'pointer' }}
          onClick={() => handleOptionClick('Settings')}
        >
          Settings
        </p>
        <p
          style={{ padding: 20, cursor: 'pointer' }}
          onClick={() => handleOptionClick('About')}
        >
          About
        </p>
      </ul>
      <ExtendedScreen isExpanded={isExpanded} onToggleExpand={handleToggleExpand}>
        {renderContent()}
      </ExtendedScreen>
    </div>
  );
}

export default Sidebar;

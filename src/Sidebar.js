import React, { useState } from 'react';
import ExtendedScreen from './ExtendedScreen';
import FollowUp from './Screens/FollowUp';
import RoutesS from './Screens/RoutesS';
import Settings from './Screens/Settings';
import About from './Screens/About';

function Sidebar() {
    const [selectedOption, setSelectedOption] = useState('Follow Up');

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const renderContent = () => {
        switch (selectedOption.toLowerCase()) {
            case 'follow up':
                return <FollowUp />;
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
                fontFamily : 'dubai',
                fontSize:25,
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
                <li
                    style={{ padding: 20, cursor: 'pointer' }}
                    onClick={() => handleOptionClick('Follow Up')}
                >
                    Follow Up
                </li>
                <li
                    style={{ padding: 20, cursor: 'pointer' }}
                    onClick={() => handleOptionClick('Route')}
                >
                    Route
                </li>
                <li
                    style={{ padding: 20, cursor: 'pointer' }}
                    onClick={() => handleOptionClick('Settings')}
                >
                    Settings
                </li>
                <li
                    style={{ padding: 20, cursor: 'pointer' }}
                    onClick={() => handleOptionClick('About')}
                >
                    About
                </li>
            </ul>
            <ExtendedScreen>{renderContent()}</ExtendedScreen>
        </div>
    );
}

export default Sidebar;

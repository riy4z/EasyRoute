import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const ExtendedScreen = ({ children, isExpanded, onToggleExpand }) => {
  return (
    <div
      style={{
        width: isExpanded ? '300px' : '0px',
        height: '100%',
        backgroundColor: isExpanded ? 'white' : '#282c34',
        color: 'black',
        position: 'fixed',
        top: 28.5,
        left: 250,
        padding: '20px',
        zIndex: 0,
        transition: 'width 0.3s ease-in-out',
      }}
    >
      {isExpanded ? (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <RxCrossCircled
              onClick={onToggleExpand}
              style={{ cursor: 'pointer' }}
            />
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ExtendedScreen;

import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const ExtendedScreen = ({ children, isExpanded, onToggleExpand }) => {
  return (
    <div
      style={{
        width: isExpanded ? '300px' : '0px',
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        position: 'fixed',
        top: 0,
        left: isExpanded ? '300px' : '-300px', // Adjusted the left property to completely hide the component
        padding: '20px',
        zIndex: -1,
        transition: 'left 0.3s ease-in-out, width 0.3s ease-in-out',
      }}
    >
      {isExpanded ? (
        <div>
          <div style={{ marginBottom: '10px', marginLeft: '280px' }}>
            <RxCrossCircled onClick={onToggleExpand} style={{ cursor: 'pointer' }} />
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ExtendedScreen;

import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const ExtendedScreen = ({ children, isExpanded, onToggleExpand }) => {

  return (
    <div
      style={{
        width: isExpanded ? 300 : 0,
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        position: 'absolute',
        top: 0,
        left: isExpanded ? 290 : -300,
        padding: 20,
        zIndex: 0,
        transition: 'transform 0.3s ease', // Using transform for transition effect
        transform: isExpanded ? 'scale(1)' : 'scale(0)', // Adjusting the scale based on the expansion state
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

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
        transition : 'opacity 0.6s ease',
        opacity : isExpanded ? 1:0, 
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

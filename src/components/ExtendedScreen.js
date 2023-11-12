import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const ExtendedScreen = ({ children, isExpanded, onToggleExpand }) => {

  return (
    <div
      //class=" isExpanded ? 'w-300' : 'hidden' left-{{ isExpanded ? 275 : -300 }} h-full bg-white text-black absolute p-5 z-5 transition-opacity "
      style={{
        width: isExpanded ? 300 : 0,
        height: '100%',
        backgroundColor: 'white',
        color: 'black',
        position: 'absolute',
        top: 0,
        left: isExpanded ? 275 : -300,
        padding: 10,
        zIndex: 0,
        transition : 'opacity 0.6s ease',
        opacity : isExpanded ? 1:0, 
      }}
    >
      {isExpanded ? (
        <div>
          <div style={{ marginBottom: '10px', marginLeft: '250px' }}>
            <RxCrossCircled onClick={onToggleExpand} style={{ cursor: 'pointer' }} />
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ExtendedScreen;

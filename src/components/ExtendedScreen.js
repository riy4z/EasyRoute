import React from 'react';
import { RxCrossCircled } from 'react-icons/rx';

const ExtendedScreen = ({ children, isExpanded, onToggleExpand }) => {

  return (
    <div
      className={`${
      isExpanded ? 'w-[300px] left-[275px] opacity-100' : 'w-0 left-[-300px] opacity-0'
    } absolute top-0 right-0 bg-white text-black w-[300px] h-full p-2 z-0 transition-opacity ease-out duration-700 `}
      // style={{
      //   width: isExpanded ? 300 : 0,
      //   height: '100%',
      //   backgroundColor: 'white',
      //   color: 'black',
      //   position: 'absolute',
      //   top: 0,
      //   left: isExpanded ? 275 : -300,
      //   padding: 10,
      //   zIndex: 0,
      //   transition : 'opacity 0.6s ease',
      //   opacity : isExpanded ? 1:0, 
      // }}
    >
      {isExpanded ? (
        <div>
          <div style={{ marginBottom: '10px', marginLeft: '250px' }}>
            <RxCrossCircled onClick={onToggleExpand}  className='cursor-pointer mt-4' />
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ExtendedScreen;

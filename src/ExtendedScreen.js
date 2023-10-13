import React from "react";

const ExtendedScreen = ({ children }) => {
    return (
        <div
            style={{
                width: '300px',
                height: '100%',
                backgroundColor: 'white',
                color: 'black', 
                position: 'fixed',
                top: 28.5,
                left: 250,
                padding: '20px',
                zIndex: 0, 
            }}
        >
            {children}
        </div>
    );
};

export default ExtendedScreen;
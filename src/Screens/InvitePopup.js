import React, { useState } from 'react';


function InvitePopup(props) {
  const [email, setEmail] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleInviteClick = () => {
    if (!email) {
      alert('Please fill in the email');
      return;
    }

    // Add your logic for inviting users with the email address here.
    // You can use the 'email' state variable for the entered email address.
  };
  const handleCloseClick = () => {
    setIsOpen(false);
  };
  if (!isOpen) {
    return null; // Don't render anything if the popup is closed
  }
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full backdrop-filter backdrop-blur-md">
    <div className="bg-white p-8 rounded-lg shadow-lg z-50 max-w-md mx-auto">
    <div className="absolute top-4 right-4 cursor-pointer" onClick={handleCloseClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-500 hover:text-gray-700 h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <div className="text-center mb-4">
        <h2 className="text-3xl font-bold text-center mb-4">Invite Users</h2>
        <label className="block mb-1 text-gray-700 text-sm">Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter Email"
          required
          style={{
            padding: '8px', // Adjust the padding as needed
            fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
            width: '100%', // Make it full width
            border: '1px solid #ccc', // Add a border
            borderRadius: '0.375rem', // Add some border radius
          }}
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleInviteClick}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 text-sm"
        >
          Invite
        </button>
      </div>
    </div>
  </div>
  );
}
export default InvitePopup;

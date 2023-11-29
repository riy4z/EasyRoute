import React, { Component } from "react";
import axios from 'axios';
import { RxCrossCircled } from "react-icons/rx";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      city: "",
      zipcode: "",
      longitude: null,
      latitude: null,
      isHovered: false
    };
  }

  


  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = () => {
    // ... existing code for handling user input

    const { address, city, state, zipcode } = this.state;

    // Use a geocoding service to fetch longitude and latitude
    const addressString = `${address}, ${city}, ${state} ${zipcode}`;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: addressString,
        key: 'AIzaSyAEBs7HmfIN_AB-Anpl2YP4jIOewJBgt_U', // Replace with your actual API key
      }
    })
      .then(response => {
        const { results } = response.data;
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          this.setState({ latitude: lat, longitude: lng }, () => {
            // Once the state is updated with longitude and latitude, proceed to save the data
            this.saveAddressData();
          });
        } else {
          console.error('No results found for the address.');
        }
      })
      .catch(error => {
        console.error('Error fetching geocoding data:', error);
      });
  };

  saveAddressData = () => {
    const { firstName, lastName, address, state, city, zipcode, longitude, latitude } = this.state;

    const accountData = {
      
      "First Name": firstName,
      "Last Name": lastName,
      "Street Address": address,
      "City": city,
      "State": state,
      "ZIP Code": zipcode,
      "longitude": longitude,
      "latitude": latitude,
    };

    axios.post('http://localhost:4000/api/store-address-data', accountData)
      .then(response => {
        console.log('Account data saved');
        this.onClose();
      })
      .catch(error => {
        console.error('Error saving account data:', error);
      });
  };

  onClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose(); // Close the popup using the provided onClose function
    }
  };


  

  render() {
    const { firstName, lastName, address, state, city, zipcode } = this.state;
    const { onClose } = this.props;

    const popupStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
      zIndex: 999, // Make sure it's on top
      background: '#394359',
    };

    const labelStyle = {
      display: "block", // Display the labels as blocks to place them on new lines
      marginBottom: "5px",// Add margin bottom for spacing between labels and inputs
      color: 'white', 
    };

    const inputStyle = {
      marginBottom: "10px", // Add margin bottom for spacing between inputs
     
    };

    const buttonStyle1 = {
      margin: "5px",// Add margin for spacing between buttons
      marginTop: '30px',
      marginLeft: "50px",
      width: "50%",
      padding: '8px 20px', /* Adjust the padding to change the button size */
      fontSize: '16px',
      backgroundColor: "white",
      fontWeight: '600',
      color: '#394359',
      borderRadius: '10px',
      cursor: 'pointer',
    };

    const buttonStyle2 = {
      margin: "5px",// Add margin for spacing between buttons
      marginTop: '30px',
      marginLeft: "26%",
      width: "50%",
      padding: '8px 20px', /* Adjust the padding to change the button size */
      fontSize: '16px',
      backgroundColor: "white",
      fontWeight: '600',
      color: '#394359',
      borderRadius: '10px',
      cursor: 'pointer',
    };

    const buttonContainerStyle = {
      display: "flex",
      justifyContent: "flex-end",
    };

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-md font-sans">
        <button onClick={onClose}>
              <RxCrossCircled className="absolute top-4 right-4 cursor-pointer"/>
            </button>
        <div>
          <h2 className="text-3xl font-bold text-center mb-4">Add New Account</h2>
          <hr className="my-4" />
          <label className="block mb-1 text-gray-700 text-sm">First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />
          <label className="block mb-1 text-gray-700 text-sm">Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />
          <label className="block mb-1 text-gray-700 text-sm">Street Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />

<label className="block mb-1 text-gray-700 text-sm">City:</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />

<label className="block mb-1 text-gray-700 text-sm">State:</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={state}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />

<label className="block mb-1 text-gray-700 text-sm">Zip Code:</label>
          <input
            type="text"
            name="zipcode"
            placeholder="Zip Code"
            value={zipcode}
            onChange={this.handleInputChange}
            style={{
              padding: '8px', // Adjust the padding as needed
              fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
              width: '100%', // Make it full width
              border: '1px solid #ccc', // Add a border
              borderRadius: '0.375rem', // Add some border radius
            }}
          />
          
          <p style={{ margin: "10px 0" }}></p> {/* Empty paragraph for spacing */}
          <div style={buttonContainerStyle}>
          <button
          onClick={this.handleSave}
          className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md transition duration-300 text-sm"
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          Save
        </button>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;

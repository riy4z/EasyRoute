import React, { Component } from "react";
import axios from 'axios';

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
      <div className="popup-overlay">
        <div style={popupStyle}>
          <h2 style={labelStyle}>Add New Account</h2>
          <label style={labelStyle}>First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={firstName}
            onChange={this.handleInputChange}
            style={inputStyle}
          />
          <label style={labelStyle}>Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={this.handleInputChange}
            style={inputStyle}
          />
          <label style={labelStyle}>Street Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={this.handleInputChange}
            style={inputStyle}
          />

<label style={labelStyle}>City:</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={this.handleInputChange}
            style={inputStyle}
          />

<label style={labelStyle}>State:</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={state}
            onChange={this.handleInputChange}
            style={inputStyle}
          />

<label style={labelStyle}>Zip Code:</label>
          <input
            type="text"
            name="zipcode"
            placeholder="Zip Code"
            value={zipcode}
            onChange={this.handleInputChange}
            style={inputStyle}
          />
          
          <p style={{ margin: "10px 0" }}></p> {/* Empty paragraph for spacing */}
          <div style={buttonContainerStyle}>
            <button onClick={this.handleSave} style={buttonStyle1}>
              Save
            </button>
            <button onClick={onClose} style={buttonStyle2}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;

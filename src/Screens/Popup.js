import React, { Component } from "react";
import axios from 'axios';

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      state: "",
      city: "",
      zipcode: "",
      longitude: null,
      latitude: null,
      isHovered: false,
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = () => {
    const { address, city, state, zipcode } = this.state;
    const addressString = `${address}, ${city}, ${state} ${zipcode}`;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: addressString,
        key: 'YOUR_GOOGLE_MAPS_API_KEY',
      }
    })
      .then(response => {
        const { results } = response.data;
        if (results && results.length > 0) {
          const { lat, lng } = results[0].geometry.location;
          this.setState({ latitude: lat, longitude: lng }, () => {
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
    const { firstName, lastName, phoneNumber, address, state, city, zipcode, longitude, latitude } = this.state;

    const accountData = {
      "First Name": firstName,
      "Last Name": lastName,
      "Phone Number": phoneNumber,
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
      onClose();
    }
  };

  render() {
    const { firstName, lastName, phoneNumber, address, state, city, zipcode } = this.state;
    const { onClose } = this.props;

    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg z-50 w-11/12 max-w-md font-sans">
        <div className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>
          <span role="img" aria-label="close" className="text-3xl">&#9447;</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Add New Account</h2>
        <hr className="my-4" />
        <label className="block mb-1 text-gray-700 text-sm">First Name:</label>
        <input
          type="text"
          name="firstName"
          placeholder="Enter First Name"
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
        <label className="block mb-1 text-gray-700 text-sm">Second Name:</label>
        <input
          type="text"
          name="lastname"
          placeholder="Enter Second Name"
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
        <label className="block mb-1 text-gray-700 text-sm">Phone Number:</label>
        <input
          type="text"
          name="phoneNumer"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChange={this.handleInputChange}
          style={{
            padding: '8px', // Adjust the padding as needed
            fontSize: '1rem', // Equivalent to text-sm in Tailwind CSS
            width: '100%', // Make it full width
            border: '1px solid #ccc', // Add a border
            borderRadius: '0.375rem', // Add some border radius
          }}
        />
        <label className="block mb-1 text-gray-700 text-sm">Address:</label>
        <input
          type="text"
          name="address"
          placeholder="Enter Address"
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
        <label className="block mb-1 text-gray-700 text-sm">State:</label>
        <input
          type="text"
          name="state"
          placeholder="Enter State"
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
        <label className="block mb-1 text-gray-700 text-sm">City:</label>
        <input
          type="text"
          name="City"
          placeholder="Enter City"
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
        <label className="block mb-1 text-gray-700 text-sm">Zipcode:</label>
        <input
          type="text"
          name="zipcode"
          placeholder="Enter Zipcode"
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

        <button
          onClick={this.handleSave}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded-md transition duration-300 text-sm"
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
        >
          Save
        </button>
      </div>
    );
  }
}

export default Popup;

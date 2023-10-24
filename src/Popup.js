import React, { Component } from "react";

class Popup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      address: "",
      
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSave = () => {
    const { firstName, lastName, address } = this.state;
    // You can perform any necessary actions with this data here
    // For example, you can send it to the parent component using a callback function.
    this.props.onSave({ firstName, lastName, address,  });
  };

  render() {
    const { firstName, lastName, address } = this.state;
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
          <h2 style={labelStyle}>Create New Account</h2>
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
          <label style={labelStyle}>Address:</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
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

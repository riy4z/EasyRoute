import React from "react";
import handleFileUpload from "../handleFileUpload";
import Popup from "../Popup";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPopupOpen: false,
    };
  }

  handleFileSelect = () => {
    this.fileInput.click();
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, (data) => {
      this.props.setAddresses(data); // Pass the parsed data to the parent component
    });
  };

  openPopup = () => {
    this.setState({ isPopupOpen: true });
  };

  closePopup = () => {
    this.setState({ isPopupOpen: false });
  };

  render() {
    const buttonStyle = {
      backgroundColor: "#0066ff",
      border: "none",
      borderRadius: 10,
      color: "white",
      padding: "10px 80px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontWeight: 600,
      position: "absolute",
      fontSize: "16px",
      cursor: "pointer",
    };
    const buttonStyle1 = {
      top:50,
      backgroundColor: "black",
      border: "none",
      borderRadius: 10,
      color: "white",
      padding: "10px 80px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontWeight: 600,
      position: "absolute",
      fontSize: "16px",
      cursor: "pointer",
    };

    return (
      <div>
        <h1>Accounts</h1>

        <button style={buttonStyle} onClick={this.handleFileSelect}>
          Import Accounts
        </button>
        <input
          type="file"
          accept=".csv"
          onChange={this.handleFileChange}
          ref={(fileInput) => (this.fileInput = fileInput)}
          style={{ display: "none" }}
        />

        <button style={buttonStyle1} onClick={this.openPopup}>
          Add Account
        </button>

        {this.state.isPopupOpen && (
          <Popup onClose={this.closePopup} />
        )}

        {/* Any other content you want to show in the Account component */}
      </div>
    );
  }
}

export default Account;

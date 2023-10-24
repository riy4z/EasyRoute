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
      backgroundColor: '#394359',
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
      left:"25px"
    };
    const buttonStyle1 = {
      top:20,
      backgroundColor: '#394359',
      border: "none",
      borderRadius: 10,
      color: "white",
      padding: "10px 10px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontWeight: 600,
      position: "absolute",
      fontSize: "16px",
      cursor: "pointer",
      justifyContent:"center",
      left:"95px",
    };

    const style= {
      color: "#282c34",
      textAlign:"center"
    }

    return (
      <div>
        <h1 style={style}>Accounts</h1>

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
        <i className="fas fa-plus-circle" style={{ marginRight: 10}}></i>
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

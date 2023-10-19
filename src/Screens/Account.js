import React from "react";
import handleFileUpload from "../handleFileUpload";

class Account extends React.Component {
  handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file, (data) => {
      this.props.setAddresses(data);
    });
  };

  render() {
    return (
      <div>
        <input type="file" accept=".csv" onChange={this.handleFileChange} />
        {/* Any other content you want to show in Account component */}
      </div>
    );
  }
}     

export default Account;

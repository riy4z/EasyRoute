//App.js
import React, { Component } from "react";
import GMap from "./components/GMap";
import Sidebar from "./Screens/Sidebar";

import os from "os";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
    };
  }

  setAddresses = (addresses) => {
    this.setState({ addresses });
  };

  
  render() {
    const { addresses } = this.state;
    console.log(window.location.hostname)
    return (
      <div>
        <Sidebar setAddresses={this.setAddresses} />  
        <GMap addresses={addresses} />
      
      </div>
    );
  }
}

export default App;
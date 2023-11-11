//App.js
import React, { Component } from "react";
import GMap from "./components/GMap";
import Sidebar from "./Screens/Sidebar";



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
    
    return (
      <div>
        <Sidebar setAddresses={this.setAddresses} />
        <GMap addresses={addresses} />

      </div>
    );
  }
}

export default App;
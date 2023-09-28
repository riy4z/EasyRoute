import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import Papa from "papaparse";
import "../src/ImportButton.css";

const style = {
  left:270,
  top:5,
  width: "100%",
  height: "100%",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      markers: []
    };
  }


  handleFileUpload = (e) => {

    const file = e.target.files[0];
    
    
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const csvData = event.target.result;
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          // Specify the columns for Street Address, City, and Zip Code
          columns: ["Street Address", "City", "Zip Code"],
          complete: (result) => {
            if (result && result.data) {
              const addresses = result.data.map((row) => ({
                streetAddress: row["Street Address"],
                city: row["City"],
                zipCode: row["Zip Code"],
              }));
              this.createPinsFromAddresses(addresses);
            }
          },
        });
      };

      reader.readAsText(file);
    }
  };

  createPinsFromAddresses = (addresses) => {
    const { google } = this.props;
    const geocoder = new google.maps.Geocoder();
    const markers = [];

    addresses.forEach((addressData) => {
      // Construct the full address from components
      const fullAddress = `${addressData.streetAddress}, ${addressData.city}, ${addressData.zipCode}`;

      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const location = results[0].geometry.location;
          markers.push({
            position: { lat: location.lat(), lng: location.lng() },
          });
          this.setState({ markers });
        }
      });
    });
  };

  render() {
    const { markers} = this.state;

    return (
      <>
      
      <input
    type="file"
    accept=".csv"
    onChange={this.handleFileUpload}
    
  />
    <div  style={{width: '250px',
    height: '100%',
    backgroundColor: '#000000',
    color: 'white',
    position: 'fixed',
    top: 28.5,
    left: 0,
    padding: '20px'}}>
          <h2 style={{fontSize:40}}>EasyRoute</h2>
          <ul>
            <li style={{padding:20}}>Team</li>
            <li style={{padding:20}}>Support</li>
            <li style={{padding:20}}>Settings</li>
            <li style={{padding:20}}>About</li>
          </ul>
         </div>
        
          
        <Map
          google={this.props.google}
          style={style}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={false}
          initialCenter={{
            lat: 41.977226,
            lng: -87.836723,
          }}
          zoom={12}
          fullscreenControl={false} 
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              name={`Marker ${index}`}
            />
          ))}
        </Map>
          
      </>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyAnjRnY_9rEuXPhMHafgvZLflazp61NgO4",
})(App);
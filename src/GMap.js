import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import axios from 'axios';

class GMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      initialCenter: null, 
    };
  }
       
  sendAddressDataToBackend = async (addressData) => {
  
    try {
      const response = await axios.post('http://localhost:4000/api/store-address-data', addressData, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      // console.error('Errror saving address data:', error);
      console.log("error")
    }
  }
  // Add a new method to get the user's current location
  getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { coords } = position;
        this.setState({
          initialCenter: {
            lat: coords.latitude,
            lng: coords.longitude,
          },
        });
      }, () => {
        // Error handling when the user's location is not available
        this.setState({
          initialCenter: {
            lat: 41.977226,
            lng: -87.836723,
          },
        });
      });
    } else {
      // If geolocation is not supported, set the default coordinates
      this.setState({
        initialCenter: {
          lat: 41.977226,
          lng: -87.836723,
        },
      });
    }
  }

  componentDidMount() {
    // Get the user's location when the component mounts
    this.getUserLocation();
  }

  createPinsFromAddresses = (addresses) => {
    if (!addresses || addresses.length === 0) {
      return;
    }

    const { google } = this.props;
    const geocoder = new google.maps.Geocoder();
    const markers = [];

    const logGeocodingError = (status, address) => {
      if (status === 'ZERO_RESULTS') {
        console.error('No results found for the address:', address);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    };

    const geocodeAddress = async (addressData) => {
      if (!addressData["Street Address"] || !addressData["City"] || !addressData["ZIP Code"]) {
        console.error('Invalid address data:', addressData);
        return;
      }
      const fullAddress = `${addressData["Street Address"]}, ${addressData["City"]}, ${addressData["ZIP Code"]}`;
    
      try {
        const geo = await new Promise((resolve) =>
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              const longitude = location.lng();
              const latitude = location.lat();
              
              // Include longitude and latitude in the addressData object
              addressData.longitude = longitude;
              addressData.latitude = latitude;
    
              markers.push({ position: { lat: latitude, lng: longitude } });
            } else {
              logGeocodingError(status, fullAddress);
            }
            resolve();
          })
        );
      } catch (error) {
        console.error('Geocoding error:', error);
      }

    
      // Send addressData to the backend
      this.sendAddressDataToBackend(addressData);
    
    };

    // Iterate through the addresses and geocode them sequentially
    const geocodePromises = addresses.map((addressData) => geocodeAddress(addressData));

    // Wait for all geocoding promises to complete
    Promise.all(geocodePromises).then(() => {
      this.setState({ markers });
    });
  };


  
  componentDidUpdate(prevProps) {
    if (prevProps.addresses !== this.props.addresses) {
      this.createPinsFromAddresses(this.props.addresses);
    }
  }
  

  render() {
    const { markers, initialCenter } = this.state;

    return (
      <>
        {initialCenter && (
          <Map
            google={this.props.google}
            style={{ width: "100%", height: "100%", position: "fixed" }}
            containerElement={<div style={{ height: "100%" }} />}
            mapElement={<div style={{ height: "100%" }} />}
            mapTypeControl={false}
            streetViewControl={false}
            zoomControl={false}
            initialCenter={initialCenter}
            zoom={12}
            disableDoubleClickZoom={true}
            fullscreenControl={false}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position} name={`Marker ${index}`} />
            ))}
          </Map>
        )}
      </>
    );
  }
}


export default GoogleApiWrapper({
  apiKey: "AIzaSyAnjRnY_9rEuXPhMHafgvZLflazp61NgO4",
})(GMap);

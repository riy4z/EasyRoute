import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class GMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      initialCenter: {
        lat: 41.977226,
        lng: -87.836723,
      },
    };
  }

  createPinsFromAddresses = async (addresses) => {
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
  
    for (let i = 0; i < addresses.length; i++) {
      const addressData = addresses[i];
      if (!addressData["Street Address"] || !addressData["City"] || !addressData["ZIP Code"]) {
        console.error('Invalid address data:', addressData);
        continue;
      }
      const fullAddress = `${addressData["Street Address"]}, ${addressData["City"]}, ${addressData["ZIP Code"]}`;
      console.log('Full address:', fullAddress);
      try {
        const response = await new Promise((resolve) =>
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const location = results[0].geometry.location;
              console.log('Geolocation data:', location.lat(), location.lng());
              markers.push({ position: { lat: location.lat(), lng: location.lng() } });
            } else {
              logGeocodingError(status, fullAddress);
            }
            resolve();
          })
        );
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    }
  
    console.log('Markers:', markers);
    this.setState({ markers });
  };
  
  
  
  

  componentDidUpdate(prevProps) {
    if (prevProps.addresses !== this.props.addresses) {
      console.log('Updated Addresses:', this.props.addresses);
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

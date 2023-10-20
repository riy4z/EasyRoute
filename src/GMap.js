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

  createPinsFromAddresses = (addresses) => {
    if (!addresses || addresses.length === 0) {
      return;
    }

    const { google } = this.props;
    const geocoder = new google.maps.Geocoder();
    const markers = [];

    const geocodeAllAddresses = async () => {
      for (let i = 0; i < addresses.length; i++) {
        const addressData = addresses[i];
        const fullAddress = `${addressData.streetAddress}, ${addressData.city}, ${addressData.zipCode}`;
        console.log("Geocoding address:", fullAddress);
        await new Promise((resolve) =>
          geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
              const location = results[0].geometry.location;
              markers.push({ position: { lat: location.lat(), lng: location.lng() } });
              console.log("Marker added for:", fullAddress);
            } else {
              console.error("Geocode was not successful for the following reason: " + status);
            }
            resolve();
          })
        );
      }

      this.setState({ markers }, () => {
        console.log("Markers state updated:", this.state.markers);
      });
    };

    geocodeAllAddresses();
  };

  componentDidMount() {
    this.createPinsFromAddresses(this.props.addresses);
  }

  render() {
    const { markers, initialCenter } = this.state;

    return (
      <>
        {initialCenter && (
          <Map
            google={this.props.google}
            style={{ width: "100%", height: "100%", position: "fixed", }}
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

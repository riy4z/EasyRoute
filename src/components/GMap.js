// GMap.js
import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import * as MapFunctions from "./mapFunctions";

class GMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      initialCenter: null,
    };
  }

  componentDidMount() {
    MapFunctions.getUserLocation(
      (position) => {
        const { coords } = position;
        this.setState({
          initialCenter: {
            lat: coords.latitude,
            lng: coords.longitude,
          },
        });
      },
      () => {
        this.setState({
          initialCenter: {
            lat: 41.977226,
            lng: -87.836723,
          },
        });
      }
    );
    this.createPinsFromAddresses(this.props.addresses); 
    // MapFunctions.getAddressesFromDatabase(this.createPinsFromAddresses);
  }

  componentDidUpdate(prevProps) {
    // Check if addresses prop has changed
    if (prevProps.addresses !== this.props.addresses) {
      console.log("Addresses changed:", this.props.addresses);
      this.createPinsFromAddresses(this.props.addresses);
    }
  }
  createPinsFromAddresses = (addresses) => {
    MapFunctions.createPinsFromAddresses(addresses, this.props.google, this.setMarkers);
  };

  setMarkers = (markers) => {
    this.setState({ markers });
  };

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
  apiKey: "AIzaSyAEBs7HmfIN_AB-Anpl2YP4jIOewJBgt_U",
})(GMap);

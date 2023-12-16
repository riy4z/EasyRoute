// GMap.js
import React, { useState, useEffect } from "react";
import { Map, GoogleApiWrapper, Marker, Polyline } from "google-maps-react";
import * as MapFunctions from "./mapFunctions";
import AccountDetails from "../Screens/AccountDetails"; 

const GMap = (props) => {
  const [markers, setMarkers] = useState([]);
  const [initialCenter, setInitialCenter] = useState(null);
  const [polylines, setPolylines] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    MapFunctions.getUserLocation(
      (position) => {
        const { coords } = position;
        setInitialCenter({
          lat: coords.latitude,
          lng: coords.longitude,
        });
      },
      () => {
        setInitialCenter({
          lat: 41.977226,
          lng: -87.836723,
        });
      }
    );
    MapFunctions.createPinsFromAddresses(props.addresses, props.google, setMarkers);
  }, [props.addresses, props.google]);

  useEffect(() => {
    MapFunctions.createRoutesBetweenMarkers(markers, props.google, setPolylines);
  }, [markers, props.google]);  

 const handleMarkerClick = (index) => {
  fetch(`http://localhost:4000/api/get-address-data-marker?markerId=${index}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      setSelectedMarker(data);
      console.log(`Marker clicked: ${index}`);
      console.log(selectedMarker);
    })
    .catch(error => {
      console.error('Error fetching address data:', error);
    });
};

  return (
    <>
      {initialCenter && (
        <>
        <Map
          google={props.google}
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
            <Marker key={marker.markerId} position={marker.position} name={`Marker ${index}`} onClick={() => handleMarkerClick(marker.markerId)}/>
          ))}

          {polylines.length > 0 &&
            polylines.map((polyline, index) => (
              <Polyline
                key={index}
                path={polyline.getPath().getArray()}
                options={{
                  strokeColor: "#0096FF",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            ))}
        </Map>
        {selectedMarker && (
          <div>
            <AccountDetails
              addressData={selectedMarker[0]} // Pass the selected marker's data to AccountDetails
              isExpanded={true} // Set isExpanded to true to render the AccountDetails component
              onToggleExpand={() => setSelectedMarker(null)} // Close the AccountDetails component when needed
            />
            </div>
          )}
        </>
      )}
    </>
  );
};


export default GoogleApiWrapper({
  apiKey: "AIzaSyAEBs7HmfIN_AB-Anpl2YP4jIOewJBgt_U",
})(GMap);

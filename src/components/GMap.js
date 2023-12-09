  // GMap.js
  import React, { useState, useEffect, useRef } from "react";
  import { Map, GoogleApiWrapper, Marker, Polyline, Polygon } from "google-maps-react";
  import * as MapFunctions from "./mapFunctions";

  const GMap = (props) => {
    const [markers, setMarkers] = useState([]);
    const [initialCenter, setInitialCenter] = useState(null);
    const [polylines, setPolylines] = useState([]);
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [lassoCoordinates, setLassoCoordinates] = useState([]);
    const mapRef = useRef(null);

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


    useEffect(()=>{
      MapFunctions.createRoutesBetweenMarkers(selectedMarkers,props.google,setPolylines);
    }, [selectedMarkers, props.google],)

    useEffect(() => {
      if (!props.LassoActive && lassoCoordinates.length > 0) {
        handlePolygonComplete();
        setLassoCoordinates([]); // Clear lassoCoordinates after handling the polygon
      }
    }, [props.LassoActive, lassoCoordinates]);
    const handleMapClick = (mapProps, map, clickEvent) => {
      if (props.LassoActive) {
        const clickedCoords = { lat: clickEvent.latLng.lat(), lng: clickEvent.latLng.lng() };
        setLassoCoordinates((prevCoords) => [...prevCoords, clickedCoords]);
      }
    };

    const handlePolygonComplete = () => {
      console.log("Polygon completed:", lassoCoordinates);
      const selectedMarkers = markers.filter((marker) => {
        const markerPosition = new props.google.maps.LatLng(marker.position.lat, marker.position.lng);
        return props.google.maps.geometry.poly.containsLocation(markerPosition, new props.google.maps.Polygon({ paths: lassoCoordinates }));
      });

      console.log("Selected Markers:", selectedMarkers);
      setSelectedMarkers(selectedMarkers);
    };
   
    const mapContainerStyle = {
      width: "full", // Equivalent to width: "100%"
      height: "full", // Equivalent to height: "100%"
    };

    return (
      <>
        {initialCenter && (
          <Map
            ref={mapRef}
            google={props.google}
            className={mapContainerStyle}
            containerElement={<div style={{ height: "100%" }} />}
            mapElement={<div style={{ height: "100%" }} />}
            mapTypeControl={false}
            streetViewControl={false}
            zoomControl={false}
            initialCenter={initialCenter}
            zoom={12}
            disableDoubleClickZoom={true}
            fullscreenControl={false}
            onClick={handleMapClick}
            onPolygonComplete={handlePolygonComplete}
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position} name={`Marker ${index}`} />
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
            {lassoCoordinates.length > 0 && (
              <Polygon
                paths={lassoCoordinates}
                options={{
                  strokeColor: "#FF0000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#FF0000",
                  fillOpacity: 0.35
                }}
                onClick={handlePolygonComplete}
              />
            )}
          </Map>
        )}
      </>
    );
  };

  export default GoogleApiWrapper({
    apiKey: "AIzaSyDpPEeB0tvNrcHp7IKJrFCXO1xBKqCjD_U",
  })(GMap);

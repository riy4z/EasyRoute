// mapFunctions.js
import axios from 'axios';


import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

export const sendAddressDataToBackend = async (addressData) => {
  try {
    const response = await axios.post('http://localhost:4000/api/store-address-data', addressData, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving address data:', error);
  }
};

export const getUserLocation = (successCallback, errorCallback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    errorCallback();
  }
};



export const createPinsFromAddresses = (addresses,  setMarkers) => {
  if (!addresses || addresses.length === 0) {
    return;
  }
  
  const markers = [];
  
  const createMarker = (latitude, longitude, markerId) => {
    markers.push({ position: { lat: latitude, lng: longitude }, markerId });
  };
  const geocoder = new window.google.maps.Geocoder();
  
  const logGeocodingError = (status, address) => {
    if (status === 'ZERO_RESULTS') {
      console.error('No results found for the address:', address);
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  };
  
  const geocodeAddress = async (addressData) => {
    if (addressData.longitude && addressData.latitude) {
      // If longitude and latitude are already present, use them to create a marker
      createMarker(addressData.latitude, addressData.longitude, addressData.markerId);
      return;
    }
    
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
            
            const markerId = uuidv4(); // Generate a unique ID
            
            addressData.longitude = longitude;
            addressData.latitude = latitude;
            addressData.markerId = markerId;
            createMarker(latitude, longitude, markerId);
            sendAddressDataToBackend(addressData);
          } else {
            logGeocodingError(status, fullAddress);
          }
          resolve();
        })
        );
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    };
    
    const geocodePromises = addresses.map((addressData) => geocodeAddress(addressData));
    
    Promise.all(geocodePromises).then(() => {
      setMarkers(markers);
    });
  };
  
// In mapFunctions.js
export const createRoutesBetweenMarkers = async (markers, setPolylines) => {
  const newPolylines = [];

  if (markers.length < 2) {
    setPolylines(newPolylines);
    return;
  }

  const requests = markers.map((marker, i) => {
    if (i < markers.length - 1) {
      const origin = markers[i].position || markers[i];
      const destination = markers[i + 1].position || markers[i + 1];

      const directionsService = new window.google.maps.DirectionsService();

      return new Promise((resolve) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              const polyline = new window.google.maps.Polyline({
                path: result.routes[0].overview_path,
                strokeColor: "#0096FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              });
              newPolylines.push(polyline);
              resolve();
            } else {
              console.error(`Directions request failed for route ${i + 1} due to ${status}`);
              resolve();
            }
          }
          );
        });
      }
    });
    
    await Promise.all(requests);
    
    setPolylines(newPolylines);
  };
  
  // logRouteDetails(result, i);
  
// export const logRouteDetails = (result, index) => {
//   if (!result.routes || result.routes.length === 0 || !result.routes[0].legs || result.routes[0].legs.length === 0) {
//     console.error(`Route details not available for route ${index + 1}`);
//     return;
//   }

//   const routeLeg = result.routes[0].legs[0];

//   if (!routeLeg) {
//     console.error(`Route details not available for route ${index + 1}`);
//     return;
//   }

//   const distance = routeLeg.distance ? routeLeg.distance.text : 'N/A';
//   const duration = routeLeg.duration ? routeLeg.duration.text : 'N/A';

//   console.log(`Route ${index + 1}: Distance - ${distance}, Duration - ${duration}`);
// };

export const getRoutesDetailsBetweenMarkers = async (markers) => {
  const routesDetails = [];

  if (markers.length < 2) {
    return routesDetails;
  }

  const requests = markers.map((marker, i) => {
    if (i < markers.length - 1) {
      const origin = markers[i].position || markers[i];
      const destination = markers[i + 1].position || markers[i + 1];

      const directionsService = new window.google.maps.DirectionsService();

      return new Promise((resolve) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              const routeDetails = {
                index: i + 1,
                duration: result.routes[0].legs[0].duration.text,
                distance: result.routes[0].legs[0].distance.text,
              };
              routesDetails.push(routeDetails);
              resolve();
            } else {
              console.error(`Directions request failed for route ${i + 1} due to ${status}`);
              resolve();
            }
          }
        );
      });
    }
  });

  await Promise.all(requests);
  return routesDetails;
};


// New function that accepts an array of coordinates
export const createRoutesBetweenCoordinates = async (coordinates, setPolylines) => {
    const markers = coordinates.map(coord => ({ position: coord }));
    await createRoutesBetweenMarkers(markers, setPolylines);
};

export const createCirclePolygon = (circle) => {
  const numPoints = 100; // Adjust the number of points for the circle approximation
  const radius = circle.radius / 6371; // Convert radius to radians

  const circlePolygon = Array.from({ length: numPoints }, (_, index) => {
      const theta = (index / numPoints) * (2 * Math.PI);
      const x = circle.center.lng + radius * Math.cos(theta);
      const y = circle.center.lat + radius * Math.sin(theta);
      return { lat: y, lng: x };
  });

  return circlePolygon;
};


  
  export const getAddressesFromDatabase = async (createPinsFromAddresses) => {
    try {
      const response = await axios.get('http://localhost:4000/api/get-address-data');
      const addresses = await response.data;
      createPinsFromAddresses(addresses);
    } catch (error) {
      console.error('Error retrieving addresses from the database:', error);
    }
  }


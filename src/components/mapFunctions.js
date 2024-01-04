// mapFunctions.js
import { v4 as uuidv4 } from 'uuid';
import api from "../config/api"

export const sendAddressDataToBackend = async (addressData) => {
  try {
    const response = await api.post('/store-address-data', addressData, {
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



export const createPinsFromAddresses = (addresses, setMarkers) => {
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
                      
                      createMarker(latitude, longitude, markerId);
                      sendAddressDataToBackend({ ...addressData, longitude, latitude, markerId });
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

  const origin = markers[0].position || markers[0];
  const destination = markers[markers.length - 1].position || markers[markers.length - 1];
  const waypoints = markers.slice(1, markers.length - 1).map(marker => ({
    location: marker.position || marker
  }));

  const directionsService = new window.google.maps.DirectionsService();

  directionsService.route(
    {
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      // Optimize the order of waypoints
    },
    (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        const route = result.routes[0];
        const legs = route.legs;

        for (let i = 0; i < legs.length; i++) {
          const leg = legs[i];
          const polyline = new window.google.maps.Polyline({
            path: leg.steps.reduce((path, step) => path.concat(step.path), []),
            strokeColor: "#0096FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });

          // Extract distance and duration information from the leg
          const distance = leg.distance.text;
          const duration = leg.duration.text;

          // Add distance and duration to the polyline object
          polyline.set("distance", distance);
          polyline.set("duration", duration);

          newPolylines.push(polyline);
        }

        setPolylines(newPolylines);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    }
  );
};



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

// Rest of the code remains the same

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


export const getAddressData = async (markerId) => {
  try {
      const response = await fetch(`http://localhost:4000/api/get-address-data?markerId=${markerId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data && data.length > 0 ? data[0] : null;
  } catch (error) {
      console.error('Error fetching address data:', error);
      return null;
  }
};

  
  export const getAddressesFromDatabase = async (createPinsFromAddresses) => {
    try {
      const response = await api.get('/get-address-data');
      const addresses = await response.data;
      createPinsFromAddresses(addresses);
    } catch (error) {
      console.error('Error retrieving addresses from the database:', error);
    }
  }


  export const createMarkerFromAddress = async (addressData, markerId, setMarkers) => {
      const fullAddress = `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.zipCode}`;
    
      const geocoder = new window.google.maps.Geocoder();
    
      const logGeocodingError = (status, address) => {
          if (status === 'ZERO_RESULTS') {
              console.error('No results found for the address:', address);
          } else {
              console.error('Geocode was not successful for the following reason: ' + status);
          }
      };
      
      try {
          const geo = await new Promise((resolve) =>
              geocoder.geocode({ address: fullAddress }, (results, status) => {
                  if (status === 'OK' && results[0]) {
                      const location = results[0].geometry.location;
                      const longitude = location.lng();
                      const latitude = location.lat();
    
                      const marker = {
                          position: { lat: latitude, lng: longitude },
                          markerId: markerId,
                      };
    
                      setMarkers((prevMarkers) => [...prevMarkers, marker]);
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
    
      
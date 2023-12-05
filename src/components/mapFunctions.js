// mapFunctions.js
import axios from 'axios';

export const sendAddressDataToBackend = async (addressData) => {
  try {
    // console.log(addressData)
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

export const createPinsFromAddresses = (addresses, google, setMarkers) => {
  if (!addresses || addresses.length === 0) {
    return;
  }

  const markers = [];

  const createMarker = (latitude, longitude) => {
    markers.push({ position: { lat: latitude, lng: longitude } });
  };

  const geocoder = new google.maps.Geocoder();

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
      createMarker(addressData.latitude, addressData.longitude);
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

            addressData.longitude = longitude;
            addressData.latitude = latitude;
            sendAddressDataToBackend(addressData);
            createMarker(latitude, longitude);
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

export const getAddressesFromDatabase = async (createPinsFromAddresses) => {
  try {
    const response = await axios.get('http://localhost:4000/api/get-address-data');
    const addresses = await response.data;

    createPinsFromAddresses(addresses);
  } catch (error) {
    console.error('Error retrieving addresses from the database:', error);
  }
};
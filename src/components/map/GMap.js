import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Marker, Polygon, Circle, Rectangle, Polyline, useJsApiLoader } from '@react-google-maps/api';
import * as MapFunctions from './mapFunctions';
import AccountDetails from '../../Screens/Accounts/AccountDetails';
import config from '../../config/config';
import api from '../../config/api';
import deleteIcon from '../../assets/images/remove.png';
import customMarkerIcon from '../../assets/images/map3.png'

const libraries = ['places', 'drawing'];

const GMap = (props) => {
    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const drawingManagerRef = useRef();
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [clickedMarkers, setClickedMarkers] = useState(null);
    const [accountMarker, setAccountMarker] = useState(null);
    const [polygons, setPolygons] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [initialCenter, setInitialCenter] = useState(null);
    const [polylines, setPolylines] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: config.googleMapsApiKey,
        libraries
    });

    const { onPolylinesUpdate } = props;

    useEffect(() => {
      onPolylinesUpdate && onPolylinesUpdate(polylines);
      
    }, [polylines, onPolylinesUpdate]);

    

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
       
    }, []);

    useEffect(()=>{
        if (props.ZoomToCoordinates){navigateToCoordinates(props.ZoomToCoordinates[0],props.ZoomToCoordinates[1])
            setAccountMarker(props.ZoomToCoordinates)}
    },[props.ZoomToCoordinates])

    useEffect(() => {
        if (props.startLocation) {
            MapFunctions.createMarkerFromAddress(props.startLocation, 'startLocation', setMarkers);
        }
    
        if (props.endLocation) {
            MapFunctions.createMarkerFromAddress(props.endLocation, 'endLocation', setMarkers);
        }
    
        // Check if props.addresses is empty
        if (Array.isArray(props.addresses) && props.addresses.length === 0) {
            setMarkers([]); // Set markers to an empty array
        } else {
            MapFunctions.createPinsFromAddresses(props.addresses, setMarkers);
        }
    }, [props.addresses, props.startLocation, props.endLocation]);

    const containerStyle = {
        width: '100vw',
        height: '100vh',
    };

    const onLoadMap = (map) => {
        mapRef.current = map;
    };

    const onOverlayComplete = async($overlayEvent) => {
        
        drawingManagerRef.current.setDrawingMode(null);

 
        let newShape;
        switch ($overlayEvent.type) {
            case window.google.maps.drawing.OverlayType.POLYGON:
                newShape = $overlayEvent.overlay
                    .getPath()
                    .getArray()
                    .map((latLng) => new window.google.maps.LatLng(latLng.lat(), latLng.lng()));
                break;
            case window.google.maps.drawing.OverlayType.CIRCLE:
                    const center = $overlayEvent.overlay.getCenter();
                    const radius = $overlayEvent.overlay.getRadius();
                    newShape = { center, radius };
                    break;
            case window.google.maps.drawing.OverlayType.RECTANGLE:
                const bounds = $overlayEvent.overlay.getBounds();
                const ne = bounds.getNorthEast();
                const sw = bounds.getSouthWest();
                newShape = [
                    new window.google.maps.LatLng(ne.lat(), ne.lng()),
                    new window.google.maps.LatLng(sw.lat(), ne.lng()),
                    new window.google.maps.LatLng(sw.lat(), sw.lng()),
                    new window.google.maps.LatLng(ne.lat(), sw.lng()),
                    new window.google.maps.LatLng(ne.lat(), ne.lng()),
                ];
                break;
            default:
                break;
        }
    
        if (newShape) {
            $overlayEvent.overlay?.setMap(null);
            setPolygons([...polygons, newShape]);
    
            // Determine markers inside the shape
            const markersInsideShape = markers.filter((marker) => {
                let isInside = false;
    
                if (newShape.center) {
                    // Check if the marker is inside the circle
                     const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(newShape.center, markerPosition);
                isInside = distance <= newShape.radius;
                } else if (newShape.bounds) {
                    // Check if the marker is inside the rectangle
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    isInside = newShape.bounds.contains(markerPosition);
                } else {
                    // Check if the marker is inside the polygon
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    isInside = window.google.maps.geometry.poly.containsLocation(markerPosition, new window.google.maps.Polygon({ paths: newShape }));
                }
    
                return isInside;
            });
    
            // Set the selected markers inside the shape
            const filteredNewMarkersDetails = markersInsideShape.filter(
                (newMarker) =>
                    !selectedMarkers.some(
                        (selectedMarker) => selectedMarker.markerId === newMarker.markerId
                    ) &&
                    !props.selectAddress.some(
                        (selectAddr) => selectAddr.markerId === newMarker.markerId
                    )
            );
    
            if (filteredNewMarkersDetails.length === 0) {
                // Display an alert if no new markers are added
                alert('Account already added to route');
                return; // Do not update state or call onLassoComplete
            }
          
            if (props.selectAddress.length >= 20){
                setShowPopup(true)
                setPolygons([...polygons])
                return
            }

            // Update selectedMarkers state only with non-duplicate markers
            const updatedSelectedMarkers = [...selectedMarkers, ...filteredNewMarkersDetails];
            const limitaddresses = [...updatedSelectedMarkers, ...props.selectAddress];
            if (updatedSelectedMarkers.length > 20) {
                // Display popup if waypoints limit exceeded
                setShowPopup(true);
                setPolygons([...polygons])
            } else if (limitaddresses.length > 20){
                setShowPopup(true);
                setPolygons([...polygons])
            } else {
                // Update selectedMarkers state
                setSelectedMarkers(updatedSelectedMarkers);
            
                // Update props.onLassoComplete with data from all shapes
                props.onLassoComplete(updatedSelectedMarkers);
            }

        }
    
    };


    const onDeleteDrawing = () => {
        // Check if the activePolygonIndex is valid
        if (activePolygonIndex.current !== undefined && activePolygonIndex.current < polygons.length) {
            // Get the deleted shape
            const deletedShape = polygons[activePolygonIndex.current];
    
            // Filter out markers associated with the deleted shape
            const markersToRemove = selectedMarkers.filter((marker) => {
                let isInsideDeletedShape = false;
    
                if (deletedShape.center) {
                    // Check if the marker is inside the circle
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(deletedShape.center, markerPosition);
                    isInsideDeletedShape = distance <= deletedShape.radius;
                } else if (deletedShape.bounds) {
                    // Check if the marker is inside the rectangle
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    isInsideDeletedShape = deletedShape.bounds.contains(markerPosition);
                } else {
                    // Check if the marker is inside the polygon
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    isInsideDeletedShape = window.google.maps.geometry.poly.containsLocation(markerPosition, new window.google.maps.Polygon({ paths: deletedShape }));
                }
    
                return !isInsideDeletedShape; // Keep markers outside the deleted shape
            });
    
            // Update state with filtered selectedMarkers
            setSelectedMarkers(markersToRemove);
            props.onLassoComplete(markersToRemove)
    
            // Remove the deleted shape from the polygons array
            const filteredPolygons = polygons.filter((polygon, index) => index !== activePolygonIndex.current);
            setPolygons(filteredPolygons);
        } else {
            console.error("Invalid activePolygonIndex");
        }
    };
    
    const navigateToCoordinates = (latitude, longitude) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat: latitude , lng: longitude });
            mapRef.current.setZoom(15); // You can adjust the zoom level as needed
        }
    };

    

    const onEditPolygon = (index) => {
        const polygonRef = polygonRefs.current[index];
        if (polygonRef) {
            const coordinates = polygonRef
                .getPath()
                .getArray()
                .map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng() }));
    
            const allPolygons = [...polygons];
            allPolygons[index] = coordinates;
            setPolygons(allPolygons);
    
            // Determine markers inside the edited shape
            const markersInsideShape = markers.filter((marker) => {
                let isInside = false;
    
                if (coordinates.length > 2) {
                    // Check if the marker is inside the polygon
                    const markerPosition = new window.google.maps.LatLng(marker.position.lat, marker.position.lng);
                    isInside = window.google.maps.geometry.poly.containsLocation(markerPosition, new window.google.maps.Polygon({ paths: coordinates }));
                } else if (coordinates.length === 2) {
                    // Check if the marker is inside the rectangle
                    const bounds = new window.google.maps.LatLngBounds(
                        new window.google.maps.LatLng(coordinates[0].lat, coordinates[0].lng),
                        new window.google.maps.LatLng(coordinates[1].lat, coordinates[1].lng)
                    );
                    isInside = bounds.contains(new window.google.maps.LatLng(marker.position.lat, marker.position.lng));
                } else if (coordinates.length === 1) {
                    // Check if the marker is inside the circle
                    const center = new window.google.maps.LatLng(coordinates[0].lat, coordinates[0].lng);
                    const distance = window.google.maps.geometry.spherical.computeDistanceBetween(center, marker.position);
                    isInside = distance <= coordinates[0].radius;
                }
    
                return isInside;
            });
    
            // Identify markers that were previously inside but are no longer inside the shape
            const markersToRemove = selectedMarkers.filter((selectedMarker) => {
                return !markersInsideShape.some((markerInsideShape) => markerInsideShape.markerId === selectedMarker.markerId);
            });
    
            // Combine the existing selected markers and the newly found markers inside the shape
            let updatedSelectedMarkers = [...selectedMarkers];
    
            markersInsideShape.forEach((newMarker) => {
                if (!updatedSelectedMarkers.some((selectedMarker) => selectedMarker.markerId === newMarker.markerId)) {
                    updatedSelectedMarkers.push(newMarker);
                }
            });
    
            // Remove markers that are no longer inside the shape
            updatedSelectedMarkers = updatedSelectedMarkers.filter((selectedMarker) => !markersToRemove.some((markerToRemove) => markerToRemove.markerId === selectedMarker.markerId));
    
            if (updatedSelectedMarkers.length === selectedMarkers.length) {
                // Display an alert if no new markers are added
                alert('Account already added to route');
                return; // Do not update state or call onLassoComplete
            }

            const combinedAddresses = [...updatedSelectedMarkers, ...props.selectAddress]
    
            if (updatedSelectedMarkers.length < selectedMarkers.length) {
                // If markers were removed, allow editing
                // Update selectedMarkers state
                setSelectedMarkers(updatedSelectedMarkers);
                
                // Update props.onLassoComplete with data from all shapes
                props.onLassoComplete(updatedSelectedMarkers);
            } else if (updatedSelectedMarkers.length > selectedMarkers.length && props.selectAddress.length >= 20 ) {
                // Display popup if waypoints limit exceeded after adding new markers
                setShowPopup(true);
                setPolygons([...polygons]);
            } else if (updatedSelectedMarkers.length > 20){
                setShowPopup(true);
                setPolygons([...polygons]);
            } else if (combinedAddresses.length > 20) {
                setShowPopup(true);
                setPolygons([...polygons]);
            } else {
                // Update selectedMarkers state
                setSelectedMarkers(updatedSelectedMarkers);
                
                // Update props.onLassoComplete with data from all shapes
                props.onLassoComplete(updatedSelectedMarkers);
            }
        
        
        }
    };
    
    
    
    

    const handleMarkerClick = (index) => {
        api.get(`/get-address-data-marker?markerId=${index}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            setClickedMarkers(response.data);
            console.log(`Marker clicked: ${index}`);
          })
          .catch(error => {
            console.error('Error fetching address data:', error);
          });
      };

// Create a set to keep track of processed polylines
const processedPolylines = new Set();
let lastCoordinateInEntireArray = null;
  
    useEffect(() => {
        if (props.optimizeClick && props.startLocation && props.endLocation) {
            // Extract data from start and end locations
            const origin = props.startLocation || {};
            const destination = props.endLocation || {};
    
            // Extract data from selectAddress (waypoints)
            const waypoints = props.selectAddress.map(address => address);
    
            // Create routes between markers (origin, waypoints, destination)
    
            MapFunctions.createRoutesBetweenMarkers(
                [origin, ...waypoints, destination],
                setPolylines
            );
            
        }
    }, [props.optimizeClick, props.selectAddress, props.startLocation, props.endLocation]);

    useEffect(() => {
        if (props.customRouteClick && props.startLocation && props.endLocation) {
            // Extract data from start and end locations
            const origin = props.startLocation || {};
            const destination = props.endLocation || {};
    
            // Extract data from selectAddress (waypoints)
            const waypoints = props.selectAddress.map(address => address);
    
    
            // Create routes between markers (origin, waypoints, destination)
            MapFunctions.createRoutesBetweenMarkersWithoutOptimization(
                [origin, ...waypoints, destination],
                setPolylines
            );
        }
    }, [props.customRouteClick, props.selectAddress, props.startLocation, props.endLocation]);

    useEffect(() => {
        console.log(props.savedPolylines);
        
        // Check if props.polylines is defined before updating state
        if (props.savedPolylines !== undefined) {
            setPolylines(props.savedPolylines)
        } else {
            console.warn("props.savedPolylines is undefined");
        }
    }, [props.savedPolylines, setPolylines]);

    useEffect(()=> {
        if(props.clearClick){
            setPolylines([]);
            setSelectedMarkers([]);
            props.onLassoComplete([])
            setPolygons([]);
        }
    },[props.clearClick,setPolylines,props.selectAddress,props.startLocation,props.endLocation])

    const polygonOptions = {
        fillOpacity: 0.3,
        fillColor: '#ff0000',
        strokeColor: '#ff0000',
        strokeWeight: 2,
        draggable: true,
        editable: true,
    };

    const circleOptions = {
        fillColor: '#00ff00',
        fillOpacity: 0.3,
        strokeColor: '#00ff00',
        strokeWeight: 2,
        draggable: true,
        editable: true,
    };

    const rectangleOptions = {
        fillColor: '#0000ff',
        fillOpacity: 0.3,
        strokeColor: '#0000ff',
        strokeWeight: 2,
        draggable: true,
        editable: true,
    };

    const drawingManagerOptions = {
        polygonOptions: polygonOptions,
        circleOptions: circleOptions,
        rectangleOptions: rectangleOptions,
        drawingControl: true,
        drawingControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_CENTER,
            drawingModes: [
                window.google?.maps?.drawing?.OverlayType?.POLYGON,
                window.google?.maps?.drawing?.OverlayType?.CIRCLE,
                window.google?.maps?.drawing?.OverlayType?.RECTANGLE,
            ],
        },
    };

    const onLoadPolygon = (polygon, index) => {
        polygonRefs.current[index] = polygon;
    };

    const onClickPolygon = (index) => {
        activePolygonIndex.current = index;
    };

    const onLoadDrawingManager = (drawingManager) => {
        drawingManagerRef.current = drawingManager;
    };

    const deleteIconStyle = {
        cursor: 'pointer',
        backgroundImage: `url(${deleteIcon})`,
        height: 24,
        width: 24,
        marginTop: '0.4%', 
        backgroundColor: '#fff',
        position: 'absolute',
        left: "54%",
        zIndex: 99999
    }



    return (
        isLoaded ? (
            <div className=" w-[275px] h-full leading-loose ">
                <GoogleMap
                    zoom={12}
                    center={initialCenter}
                    onLoad={onLoadMap}
                    mapContainerStyle={containerStyle}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {props.LassoActive && (
                        <div className="grid">
                            <DrawingManager
                                onLoad={onLoadDrawingManager}
                                onOverlayComplete={onOverlayComplete}
                                options={drawingManagerOptions}
                            />
                            {drawingManagerRef.current && (
                            <div
                                onClick={onDeleteDrawing} title='Delete shape'
                                style={deleteIconStyle}
                            ></div>
                            )}
                        </div>
                    )}

{polygons.map((shape, index) => {
                        if (shape.center) {
                            // Render Circle
                            return (
                                <Circle
                                    key={index}
                                    center={shape.center}
                                    radius={shape.radius}
                                    options={circleOptions}
                                    draggable
                                    editable
                                />
                            );
                        } else if (shape.bounds) {
                            // Render Rectangle
                            return (
                                <Rectangle
                                    key={index}
                                    bounds={shape.bounds}
                                    options={rectangleOptions}
                                    draggable
                                    editable
                                />
                            );
                        } else {
                            // Render Polygon
                            return (
                                <Polygon
                                    key={index}
                                    onLoad={(event) => onLoadPolygon(event, index)}
                                    onMouseDown={() => onClickPolygon(index)}
                                    onMouseUp={() => onEditPolygon(index)}
                                    onDragEnd={() => onEditPolygon(index)}
                                    options={polygonOptions}
                                    paths={shape}
                                    draggable
                                    editable
                                />
                            );
                        }
                    })}
                    {markers.map((marker, index) => (
                        <Marker key={marker.markerId} position={marker.position} name={`Marker ${index}`} onClick={() => handleMarkerClick(marker.markerId)} />
                    ))}
{accountMarker &&(
    <Marker
    position={{
        lat: accountMarker[0],
        lng: accountMarker[1]
    }}
    icon={{
        url: 'https://d1tnxy3bik2ajc.cloudfront.net/img/ic_default_h@2x.png',
        scaledSize: new window.google.maps.Size(35, 35) // Adjust the size as needed
    }}
/>
)}

{showPopup && (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
    <div className="bg-white p-7 rounded-lg shadow-lg max-w-md mx-auto">
        <button className='relative fa-solid fa-circle-xmark ml-[97%] text-2xl bottom-5' onClick={() => setShowPopup(false)}></button>
        <p className='text-xl text-red-700 font-bold'>Waypoints limit exceeded</p> 
        <p className='text-gray-500'>Only 20 allowed per route</p>
    </div>
    </div>
)}



{/*Dont Touch - Polylines Rendering Logic - Time Spent 19h*/}
{polylines.length > 0 &&
    polylines.map((polyline, index) => {
        // Check if the polyline has already been processed
        if (processedPolylines.has(index)) {
            return null;
        }

        let coordinates;
        let options;

        // Show All Routes
        if (Array.isArray(polyline)) {
            // Case when polyline is an array of coordinates
            coordinates = polyline.map((coord) => {
                // Assuming that Ig is an array and you want to map its elements
                const igArray = coord.latLngs.Fg[0].Fg;

                // Map the elements of igArray to create coordinates
                const mappedCoordinates = igArray.map((igCoord) => ({
                    lat: igCoord.lat,
                    lng: igCoord.lng
                }));

                return mappedCoordinates;
            });
            coordinates = coordinates.flat();
            options = {
                strokeColor: "#185ABC",
                strokeOpacity: 1.0,
                strokeWeight: 4,
            };
            // No markers for this case
            return <Polyline path={coordinates} options={options} key={index} />;
        } 
        
        // Route Plotted By Direction Service
        else if (polyline.getPath && typeof polyline.getPath === 'function') {
            coordinates = polyline.getPath()?.getArray() || [];
            options = {
                strokeColor: "#4285F4",
                strokeOpacity: 1.0,
                strokeWeight: 4,
            };
        } 
        
        // Route From Saved Routes
        else if (
            polyline.latLngs &&
            polyline.latLngs.Fg &&
            Array.isArray(polyline.latLngs.Fg) &&
            polyline.latLngs.Fg[0] &&
            Array.isArray(polyline.latLngs.Fg[0].Fg)
        ) {
            coordinates = polyline.latLngs.Fg[0].Fg.map((coord) => ({
                lat: coord.lat,
                lng: coord.lng,
            }));
            options = {
                strokeColor: "#185ABC",
                strokeOpacity: 1.0,
                strokeWeight: 4,
            };
        }

        // Create markers for firstmost and lastmost coordinates
        const firstCoordinate = coordinates[0];
        lastCoordinateInEntireArray = coordinates[coordinates.length - 1];

        // Mark the polyline as processed
        processedPolylines.add(index);

        return (
            <React.Fragment key={index}>
                <Polyline path={coordinates} options={options} />
                {/* Marker for firstmost coordinate */}
                <Marker position={firstCoordinate}  icon={{
                                url: customMarkerIcon,
                                scaledSize: new window.google.maps.Size(35, 35), // Adjust the size as needed
                            }} label={{
                                text: (index + 1).toString(),
                                className: 'bg-white rounded-full text-sm mb-2.5 p-1 flex items-center justify-center w-5 h-5',
                              }} />
            </React.Fragment>
        );
    })}

{/* Marker for the last coordinate of the entire array */}
{lastCoordinateInEntireArray && (
    <Marker
        position={lastCoordinateInEntireArray}
        label={{text: `${polylines.length + 1}`, className:'bg-white rounded-full text-sm mb-2.5 p-1 flex items-center justify-center w-5 h-5'}}
        icon={{
            url: customMarkerIcon,
            scaledSize: new window.google.maps.Size(35, 35), // Adjust the size as needed
        }}
    />
)}




                </GoogleMap>
                {clickedMarkers && (
            <AccountDetails
              selectedLocation={props.selectedLocation}
              addressData={clickedMarkers[0]} // Pass the selected marker's data to AccountDetails
              isExpanded={true} // Set isExpanded to true to render the AccountDetails component
              onToggleExpand={() => setClickedMarkers(null)} // Close the AccountDetails component when needed
            />
          )}
            </div>
            
        ) : null
    );
};

export default GMap;

import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Marker, Polygon, Circle, Rectangle, Polyline, useJsApiLoader } from '@react-google-maps/api';
import * as MapFunctions from './mapFunctions';
import AccountDetails from '../../Screens/Accounts/AccountDetails';
import config from '../../config/config';
import api from '../../config/api';
import deleteIcon from '../../assets/images/remove.png'

const libraries = ['places', 'drawing'];

const GMap = (props) => {
    const mapRef = useRef();
    const polygonRefs = useRef([]);
    const activePolygonIndex = useRef();
    const drawingManagerRef = useRef();
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [clickedMarkers, setClickedMarkers] = useState(null);
    const [polygons, setPolygons] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [initialCenter, setInitialCenter] = useState(null);
    const [polylines, setPolylines] = useState([]);

    
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

    useEffect(() => {
        if (props.startLocation) {
            MapFunctions.createMarkerFromAddress(props.startLocation, 'startLocation', setMarkers);
        }

        if (props.endLocation) {
            MapFunctions.createMarkerFromAddress(props.endLocation, 'endLocation', setMarkers);
        }

        MapFunctions.createPinsFromAddresses(props.addresses, setMarkers);
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
        
            // Update selectedMarkers state only with non-duplicate markers
            const updatedSelectedMarkers = [...selectedMarkers, ...filteredNewMarkersDetails];
            setSelectedMarkers(updatedSelectedMarkers);
        
            // Update props.onLassoComplete with data from all shapes
            props.onLassoComplete(updatedSelectedMarkers);
        }
    
    };

    console.log(selectedMarkers)

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
    
            // Update selectedMarkers state with the combined set of markers
            setSelectedMarkers(updatedSelectedMarkers);
    
            // Update props.onLassoComplete with data from all shapes
            props.onLassoComplete(updatedSelectedMarkers);
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
            <div className='map-container' style={{ position: 'relative', display: "block" }}>
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
                const igArray = coord.latLngs.Ig[0].Ig;

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
            polyline.latLngs.Ig &&
            Array.isArray(polyline.latLngs.Ig) &&
            polyline.latLngs.Ig[0] &&
            Array.isArray(polyline.latLngs.Ig[0].Ig)
        ) {
            coordinates = polyline.latLngs.Ig[0].Ig.map((coord) => ({
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
                <Marker position={firstCoordinate} label={(index + 1).toString()} />
            </React.Fragment>
        );
    })}

{/* Marker for the last coordinate of the entire array */}
{lastCoordinateInEntireArray && (
    <Marker
        position={lastCoordinateInEntireArray}
        label={`${polylines.length + 1}`}
    />
)}




                </GoogleMap>
                {clickedMarkers && (
          <div>
            <AccountDetails
              addressData={clickedMarkers[0]} // Pass the selected marker's data to AccountDetails
              isExpanded={true} // Set isExpanded to true to render the AccountDetails component
              onToggleExpand={() => setClickedMarkers(null)} // Close the AccountDetails component when needed
            />
            </div>
          )}
            </div>
            
        ) : null
    );
};

export default GMap;

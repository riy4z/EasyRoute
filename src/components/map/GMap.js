import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Marker, Polygon, Circle, Rectangle, Polyline, useJsApiLoader } from '@react-google-maps/api';
import * as MapFunctions from './mapFunctions';
import AccountDetails from '../../Screens/Accounts/AccountDetails';
import config from '../../config/config';
import api from '../../config/api';

const libraries = ['places', 'drawing'];

const GMap = (props) => {
    const mapRef = useRef();
    const shapeRefs = useRef([]);
    const activeShapeIndex = useRef();
    const drawingManagerRef = useRef();
    const [selectedMarkers, setSelectedMarkers] = useState([]);
    const [clickedMarkers, setClickedMarkers] = useState(null);
    const [shapes, setShapes] = useState([]);
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
    
        const overlayType = $overlayEvent.type;
        const overlay = $overlayEvent.overlay;
        let newShape;

        switch (overlayType) {
            case window.google.maps.drawing.OverlayType.RECTANGLE:
                const bounds = overlay.getBounds();
                newShape = {
                    type: 'rectangle',
                    coordinates: [
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
                        { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() },
                        { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() }
                    ],
                };
                break;

            case window.google.maps.drawing.OverlayType.CIRCLE:
                const circleCenter = overlay.getCenter();
                const circleRadius = overlay.getRadius();
                newShape = {
                    type: 'circle',
                    center: { lat: circleCenter.lat(), lng: circleCenter.lng() },
                    radius: circleRadius,
                };
                break;

            case window.google.maps.drawing.OverlayType.POLYGON:
                newShape = {
                    type: 'polygon',
                    coordinates: overlay.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() })),
                };
                break;

            default:
                break;
        }

        // Update shapes state
        setShapes([...shapes, newShape]);

        // Find markers inside the shape
        const markersInsideShape = markers.filter(marker => {
            let isInsideShape = false;
    
            if (marker.position && marker.position.lat !== undefined && marker.position.lng !== undefined) {
                switch (newShape.type) {
                    case 'rectangle':
                        isInsideShape = window.google.maps.geometry.poly.containsLocation(
                            new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                            new window.google.maps.Polygon({ paths: newShape.coordinates })
                        );
                        break;
    
                    case 'circle':
                        isInsideShape = window.google.maps.geometry.spherical.computeDistanceBetween(
                            new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                            new window.google.maps.LatLng(newShape.center.lat, newShape.center.lng)
                        ) <= newShape.radius;
                        break;
    
                    case 'polygon':
                        isInsideShape = window.google.maps.geometry.poly.containsLocation(
                            new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                            new window.google.maps.Polygon({ paths: newShape.coordinates })
                        );
                        break;
    
                    default:
                        break;
                }
            }
    
            return isInsideShape;
        });
    
        // Extract details of markers inside the lasso shape
        const markersDetailsInLasso = markersInsideShape.map(async (marker) => {
            return {
                markerId: marker.markerId,
                position: marker.position,
                // addressData: await MapFunctions.getAddressDatabyMarker(marker.markerId),
            };
        });
    
        const newMarkersDetailsInLasso = await Promise.all(markersDetailsInLasso);
    
        // Check if any of the new markers are already selected based on _id
        const filteredNewMarkersDetails = newMarkersDetailsInLasso.filter(
            (newMarker) => !selectedMarkers.some((selectedMarker) => selectedMarker.markerId === newMarker.markerId)
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
    
    };
  

    const onDeleteShape = () => {
        // Remove the deleted shape and its associated polyline from the state
        const filtered = shapes.filter((shape, index) => index !== activeShapeIndex.current);
        setPolylines((prevPolylines) => prevPolylines.filter((polyline, index) => index !== activeShapeIndex.current));
        setShapes(filtered)
        // Remove the deleted shape's reference from shapeRefs.current
        shapeRefs.current = shapeRefs.current.filter((ref, index) => index !== activeShapeIndex.current);
    
        // Clear selected markers when a shape is deleted
        setSelectedMarkers([]);
        props.onLassoComplete([])
        activeShapeIndex.current = null; // Reset the active shape index
    };
    

    const isMarkerInsideShape = (marker, shape) => {
        if (marker.position && marker.position.lat !== undefined && marker.position.lng !== undefined) {
            switch (shape.type) {
                case 'rectangle':
                    return window.google.maps.geometry.poly.containsLocation(
                        new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                        new window.google.maps.Polygon({ paths: shape.coordinates })
                    );

                case 'circle':
                    return window.google.maps.geometry.spherical.computeDistanceBetween(
                        new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                        new window.google.maps.LatLng(shape.center.lat, shape.center.lng)
                    ) <= shape.radius;

                case 'polygon':
                    return window.google.maps.geometry.poly.containsLocation(
                        new window.google.maps.LatLng(marker.position.lat, marker.position.lng),
                        new window.google.maps.Polygon({ paths: shape.coordinates })
                    );

                default:
                    return false;
            }
        }

        return false;
    };

    const onEditShape = (index) => {
        const shapeRef = shapeRefs.current[index];
        if (shapeRef) {
            let coordinates = [];

            switch (shapes[index].type) {
                case 'rectangle':
                    const bounds = shapeRef.getBounds();
                    coordinates = [
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
                        { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() },
                        { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
                        { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() }
                    ];
                    break;

                case 'circle':
                    const circleCenter = shapeRef.getCenter();
                    const circleRadius = shapeRef.getRadius();
                    coordinates = MapFunctions.createCirclePolygon({
                        center: { lat: circleCenter.lat(), lng: circleCenter.lng() },
                        radius: circleRadius
                    });
                    break;

                case 'polygon':
                    coordinates = shapeRef.getPath().getArray().map(latLng => ({ lat: latLng.lat(), lng: latLng.lng() }));
                    break;

                default:
                    break;
            }

            const allShapes = [...shapes];
            allShapes[index] = {
                type: shapes[index].type,
                coordinates: coordinates,
            };
            setShapes(allShapes);

            // Find markers inside the edited shape
            const markersInsideEditedShape = markers.filter(marker => isMarkerInsideShape(marker, shapeRef));

            // Update selectedMarkers state
            setSelectedMarkers([...selectedMarkers, ...markersInsideEditedShape]);
          
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

    const onEditShapeMouseDown = (index) => {
        activeShapeIndex.current = index;
    };

    const onEditShapeMouseUp = (index) => {
        onEditShape(index);
    };

    const onEditShapeDragEnd = (index) => {
        onEditShape(index);
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
    }, [props.savedPolylines]);

    
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
                        zoomControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {props.LassoActive && (
                        <div className="grid">
                            <DrawingManager
                                onLoad={(drawingManager) => (drawingManagerRef.current = drawingManager)}
                                onOverlayComplete={onOverlayComplete}
                                options={{
                                    drawingControl: true,
                                    drawingControlOptions: {
                                        position: window.google?.maps?.ControlPosition?.TOP_CENTER,
                                        drawingModes: [
                                            window.google?.maps?.drawing?.OverlayType?.POLYGON,
                                            window.google?.maps?.drawing?.OverlayType?.CIRCLE,
                                            window.google?.maps?.drawing?.OverlayType?.RECTANGLE,
                                        ]
                                    }
                                }}
                            />
                            <span
                                onClick={onDeleteShape}
                                title='Delete shape'
                                style={{ cursor: 'pointer', height: '24px', width: '24px', marginTop: '5px', backgroundColor: '#fff', zIndex: 99999, left: "930px", position: "relative" }}
                            ></span>
                        </div>
                    )}

                    {shapes.map((shape, index) => {
                        switch (shape.type) {
                            case 'rectangle':
                                return (
                                    <Rectangle
                                        key={index}
                                        ref={(ref) => shapeRefs.current[index] = ref}
                                        onMouseDown={() => onEditShapeMouseDown(index)}
                                        onMouseUp={() => onEditShapeMouseUp(index)}
                                        onDragEnd={() => onEditShapeDragEnd(index)}
                                        options={{ ...shape, draggable: true, editable: false }}
                                    />
                                );

                            case 'circle':
                                return (
                                    <Circle
                                        key={index}
                                        ref={(ref) => shapeRefs.current[index] = ref}
                                        onMouseDown={() => onEditShapeMouseDown(index)}
                                        onMouseUp={() => onEditShapeMouseUp(index)}
                                        onDragEnd={() => onEditShapeDragEnd(index)}
                                        options={{ ...shape, draggable: true, editable: false }}
                                    />
                                );

                            case 'polygon':
                                return (
                                    <Polygon
                                        key={index}
                                        ref={(ref) => shapeRefs.current[index] = ref}
                                        onMouseDown={() => onEditShapeMouseDown(index)}
                                        onMouseUp={() => onEditShapeMouseUp(index)}
                                        onDragEnd={() => onEditShapeDragEnd(index)}
                                        options={{ ...shape, draggable: true, editable: false }}
                                    />
                                );

                            default:
                                return null;
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

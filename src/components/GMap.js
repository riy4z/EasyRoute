import React, { useRef, useState, useEffect } from 'react';
import { GoogleMap, DrawingManager, Marker, Polygon, Circle, Rectangle, Polyline, useJsApiLoader } from '@react-google-maps/api';
import * as MapFunctions from '../components/mapFunctions';
import AccountDetails from '../Screens/AccountDetails';

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
        googleMapsApiKey: 'AIzaSyCHb570UK21VsQtayMgy3X8sOFzUclZHlo',
        libraries
    });

    const { onPolylinesUpdate } = props;

    useEffect(() => {
        console.log("Start Location in GMap:", props.startLocation);
        console.log("End Location in GMap:", props.endLocation);
        // Handle start and end location data as needed in your GMap component
      }, [props.startLocation, props.endLocation]);

    useEffect(() => {
      onPolylinesUpdate && onPolylinesUpdate(polylines);
    }, [polylines, onPolylinesUpdate]);

    console.log(polylines)
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

    const onOverlayComplete = ($overlayEvent) => {
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
        const markersDetailsInLasso = markersInsideShape.map(marker => {
            return {
                markerId: marker.markerId,
                position: marker.position,
                addressData: MapFunctions.getAddressData(marker.markerId), // Implement a function to get address data based on markerId
            };
        });
    
        // Update selectedMarkers state
        setSelectedMarkers(markersDetailsInLasso);
    
        props.onLassoComplete(markersDetailsInLasso);
    
        MapFunctions.createRoutesBetweenMarkers(selectedMarkers, setPolylines);
    };
    console.log(selectedMarkers)
    const onDeleteShape = () => {
        // Remove the deleted shape and its associated polyline from the state
        setShapes((prevShapes) => prevShapes.filter((shape, index) => index !== activeShapeIndex.current));
        setPolylines((prevPolylines) => prevPolylines.filter((polyline, index) => index !== activeShapeIndex.current));
    
        // Remove the deleted shape's reference from shapeRefs.current
        shapeRefs.current = shapeRefs.current.filter((ref, index) => index !== activeShapeIndex.current);
    
        // Clear selected markers when a shape is deleted
        setSelectedMarkers([]);
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
            
            // Update routing for all shapes
            MapFunctions.createRoutesBetweenMarkers(selectedMarkers, setPolylines);
        }
    };
    console.log(selectedMarkers)
    const handleMarkerClick = (index) => {
        fetch(`http://localhost:4000/api/get-address-data-marker?markerId=${index}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            setClickedMarkers(data);
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

    useEffect(() => {
        MapFunctions.createRoutesBetweenMarkers(selectedMarkers, setPolylines);
    }, [selectedMarkers]);


    useEffect(() => {
        if (props.startLocation && props.endLocation) {
            // Extract coordinates from start and end locations
            const origin = props.startLocation.position || {
                lat: props.startLocation.latitude,
                lng: props.startLocation.longitude
            };
    
            const destination = props.endLocation.position || {
                lat: props.endLocation.latitude,
                lng: props.endLocation.longitude
            };
    
            // Extract coordinates from selectAddress (waypoints)
            const waypoints = props.selectAddress.map(address => ({
                lat: address.latitude,
                lng: address.longitude
            }));
    
            // Create routes between markers (origin, waypoints, destination)
            MapFunctions.createRoutesBetweenMarkers(
                [origin, ...waypoints, destination],
                setPolylines
            );
        }
    }, [props.selectAddress, props.startLocation, props.endLocation]);
   
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

                    {polylines.length > 0 &&
                        polylines.map((polyline, index) => (
                            <Polyline
                                key={index}
                                path={polyline.getPath().getArray()}
                                options={{
                                    strokeColor: "#603FEF",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                }}
                            />
                        ))}

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

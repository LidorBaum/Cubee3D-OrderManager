import React, { Component, useEffect, useState } from 'react'
import { GoogleApiWrapper, InfoWindow, Marker, Map } from 'google-maps-react'
import { mapStyles } from '../assets/mapStyles'
import parkService from '../services/parkService'
const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
  };

const MapContainer = (props) => {


    const [mapState, setMapState] = useState({
        showingInfoWindow: false,
        activeMarker: {},
        selectedPlace: {},
    })
    const [markersArray, setMarkersArray] = useState([])
    const [currentLocation, setCurrentLocation] = useState(null)
    useEffect(() =>{
        const getParks = async () => {
            const res = await parkService.getAllParks()
            console.log(res);
            setMarkersArray(res)
        }
        if(!currentLocation){
            navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            setCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude})
          });
        }
        getParks();
    },[currentLocation])

    const onMarkerClick = (props, marker, e) =>
        setMapState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });

    const onMapClicked = (props) => {
        if (mapState.showingInfoWindow) {
            setMapState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    };
    const containerStyle = {
        position: 'relative',
        width: '100vw',
        height: '600px'
    }
    if(markersArray.length === 0) return <h1>Loading</h1>
    return (
        <Map google={props.google}
            onClick={onMapClicked}
            zoom={currentLocation? 15: 12}
            containerStyle={containerStyle}
            initialCenter={currentLocation || {lat:"32.018654", lng:"34.738528"}}
            styles = {mapStyles.dark}
        >
            {markersArray.map(park => {
                return <Marker key={park._id} position={{lat: park.coordinates.lat, lng: park.coordinates.lng}} onClick={onMarkerClick} name={park.name} />
            })}
            <Marker position={currentLocation} icon={svgMarker} />
            
            <InfoWindow
                marker={mapState.activeMarker}
                visible={mapState.showingInfoWindow}>
                <div>
                    <h1>"test"</h1>
                </div>
            </InfoWindow>
        </Map>
    )

}


export default GoogleApiWrapper({
    apiKey: ('AIzaSyA0PnKw6ClT_i8_c4ePtiXRLg7MjyC4VCA')
})(MapContainer)
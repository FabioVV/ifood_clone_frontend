import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, InfoWindow, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {getGeocode, getLatLng} from "use-places-autocomplete"

const libraries = ["places"]

const mapContainerStyle = {
    width:'50vw',
    height:'50vh',
}

const center = {
    lat:43.653225,
    lng:-79.383186,
}

function GoogleMapComponent() {


    const {isLoaded, loadError} = useLoadScript({googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_KEY, libraries})
    const [markers, setMarkers] = useState([])
    

    const onMapClick = useCallback((event)=>{
        setMarkers(current => [...current, {
            lat:event.latLng.lat(),
            lng: event.latLng.lng(),
        }])
    }, [])

    const mapRef = useRef()
    const onMapLoad = useCallback((map)=>{
        mapRef.current = map
    })

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps..."


  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={8} center={center} onClick={onMapClick} onLoad={onMapLoad}>
        {markers.map(marker => (<Marker key={marker.lat} position={{lat:marker.lat, lng:marker.lng}} />))}
    </GoogleMap>
  )
}

export default GoogleMapComponent
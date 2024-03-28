import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, InfoWindow, Marker } from '@react-google-maps/api';

const libraries = ["places"]

const mapContainerStyle = {
    width:'100%',
    height:'50vh',
}



function GoogleMapComponent({UserGeolocation}) {

    function onSubmit(){

    }

    const center = {
        lat:UserGeolocation?.lat,
        lng:UserGeolocation?.lng,
    }


    const {isLoaded, loadError} = useLoadScript({googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_KEY, libraries})
    const [markers, setMarkers] = useState([])
    

    const onMapClick = useCallback((event)=>{
        setMarkers(current => [{
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        }])
    }, [])

    const mapRef = useRef()
    const onMapLoad = useCallback((map)=>{
        mapRef.current = map

        setMarkers(current => [...current, {
            lat: UserGeolocation?.lat,
            lng: UserGeolocation?.lng,
        }])
        
    })

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps..."


  return (
    <div id='map-container'>
        <div>
            <h1 id='address-title-maps'>{UserGeolocation?.result['formatted_address']}</h1>
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={19} center={center} onClick={onMapClick} onLoad={onMapLoad}>
                {markers.map(marker => (<Marker key={marker.lat} position={{lat:marker.lat, lng:marker.lng}} />))}
            </GoogleMap>
            <button onClick={()=>{console.log(UserGeolocation?.result)}} className='btn btn-primary sm:btn-sm md:btn-md lg:btn-lg' id="map-button">Confirmar localização</button>
        </div>
    </div>
  )
}

export default GoogleMapComponent
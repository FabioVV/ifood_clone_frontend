import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { getCurrentUser } from '../utils/UserlocalStorage';

// INFO WINDOW

const libraries = ["places"]

const mapContainerStyle = {
    width:'100%',
    height:'50vh',
}



function GoogleMapComponent({UserGeolocation, user_address_fn, user_address_obj}) {

    function onSubmit(){
        let results = UserGeolocation?.result
        let size_address_components = results['address_components'].length

        let user_address = {
            name:'',
            street:'',
            neighborhood:'',
            number:'',
            complement:'',
            city:'',
            state:'',
            zip_code:'',
            user:getCurrentUser()['id'],
          }

          user_address.number = results['address_components'][0]['long_name']
          user_address.zip_code = results['address_components'][size_address_components-1]['long_name']
          user_address.state = results['address_components'][4]['short_name']
          user_address.city = results['address_components'][3]['long_name']
          user_address.neighborhood = results['address_components'][1]['long_name']
          user_address.street = results['address_components'][2]['long_name']

          user_address_fn({...user_address_obj, ...user_address})

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
                {markers.map(marker => (<Marker key={Math.floor(Math.random() * 1000)} position={{lat:marker.lat, lng:marker.lng}} />))}
            </GoogleMap>
            <button onClick={()=>{onSubmit()}} className='btn btn-primary sm:btn-sm md:btn-md lg:btn-lg' id="map-button">Confirmar localização</button>
        </div>
    </div>
  )
}

export default GoogleMapComponent
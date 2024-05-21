import { useCallback, useEffect, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

// INFO WINDOW

const libraries = ["places"]

const mapContainerStyle = {
    width:'100%',
    height:'100vh',
}

function GoogleMapComponentTakeOut({products}) {

    const {isLoaded, loadError} = useLoadScript({googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_KEY, libraries})
    const [markers, setMarkers] = useState([])
    const mapRef = useRef()

    const [location, setLocation] = useState({
        lat: 0,
        lng: 0,
    })

    useEffect(()=>{
        (async () => {

            try{
                const results = await getGeocode({ address: products[0]?.restaurant_address })
                const {lat, lng} =  getLatLng(results[0])   

                setLocation({
                    lat:lat,
                    lng:lng,
                })

            } catch(e) {
                console.log(e)
            }
            
          })();
    },[markers])

    const center = {
        lat:location?.lat,
        lng:location?.lng,
    }



    const onMapLoad = useCallback((map)=>{
        mapRef.current = map

        setMarkers(current => [...current, {
            lat: location?.lat,
            lng: location?.lng,
        }])
        
    })

    if(loadError) return "Error loading maps"
    if(!isLoaded) return "Loading maps..."


  return (
    <div id='map-container' style={{width:'40vw', height:'50vh'}}>

        <div>
            <h1 id='address-title-maps'>{products[0]?.restaurant_name}</h1>

            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center} onLoad={onMapLoad}>
                <Marker key={Math.floor(Math.random() * 1000)} position={{lat:location?.lat, lng:location?.lng}} />            
            </GoogleMap>

        </div>
    </div>
  )
}

export default GoogleMapComponentTakeOut
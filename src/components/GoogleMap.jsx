import React, { useCallback, useRef, useState } from 'react'
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { getCurrentUser } from '../utils/UserlocalStorage';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUserToken } from '../utils/UserlocalStorage';

// INFO WINDOW

const libraries = ["places"]

const mapContainerStyle = {
    width:'100%',
    height:'50vh',
}



function GoogleMapComponent({UserGeolocation}) {

    const {isLoaded, loadError} = useLoadScript({googleMapsApiKey:import.meta.env.VITE_GOOGLE_MAPS_KEY, libraries})
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();
    let navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [markers, setMarkers] = useState([])


    const [UserAddress, setUserAddress] = useState({
        name:'',
        street:'',
        neighborhood:'',
        number:'',
        complement:'',
        type_of:'W',
        reference_point:'',
        city:'',
        state:'',
        zip_code:'',
        user:'',
    })

    const ConfirmButton = useRef()
    const AddressForm = useRef()
    const mapRef = useRef()


    async function onSubmitAddress(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/addresses/register-user-address/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:JSON.stringify({...UserAddress})
            })

            if (!res.ok) {
                console.log(res.status)
            } 
            
            const user_updated = await res.json()


            if(res.ok){
                navigate('/') 
                navigate(0)          
 
            }


            setIsLoading(false)
        } catch(error){
            console.log(errors)
        }

    }


    function onSubmit(){

        ConfirmButton.current.style.display = 'none'
        AddressForm.current.style.display = 'block'

        

        let results = UserGeolocation?.result

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

        for(let obj of results['address_components']){
            for(let type_obj of obj['types']){

                if(type_obj == 'street_number'){
                    user_address.number = obj['long_name']

                }

                if(type_obj == 'route'){
                    user_address.street = obj['long_name']

                }

                if(type_obj == 'sublocality'){
                    user_address.neighborhood = obj['long_name']

                }

                if(type_obj == 'administrative_area_level_2'){
                    user_address.city = obj['long_name']

                }

                if(type_obj == 'administrative_area_level_1'){
                    user_address.state = obj['short_name']

                }

                if(type_obj == 'postal_code'){
                    user_address.zip_code = obj['long_name']

                }
            }
        }

        setUserAddress({...UserAddress, ...user_address})
        reset({...UserAddress})
    }



    const center = {
        lat:UserGeolocation?.lat,
        lng:UserGeolocation?.lng,
    }

    

    const onMapClick = useCallback((event)=>{
        setMarkers(current => [{
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        }])
    }, [])

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


            <div style={{display:'none'}} ref={AddressForm} id='address-form'>
                <form method='post' onSubmit={handleSubmit(onSubmitAddress)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >

                    <div style={{display:'flex', flexDirection:'row', flexWrap:'wrap', gap:'1.5rem'}}>
                        <div>
                            Número
                            <input name="number" id='number' type="number" className="input input-bordered input-md w-full" placeholder="350" 
                                {...register("number", { required: "Campo obrigatório.", maxLength:{value:12, message:'Máximo de 12 caracteres'}, minLength:{value:1, message:'Necessita no minímo 1 caracter'}, onChange: (e) => {setUserAddress({...UserAddress, number:e.target.value})}, })}
                            />

                            <ErrorMessage
                                errors={errors}
                                name="number"
                                render={({ message }) => 
                                <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                    <strong className="font-bold">* {message}</strong>
                                </div>}
                            />
                        </div>
                        <div>
                            Complemento
                            <input name="complement" id='complement' type="text" className="input input-bordered input-md w-full max-w" placeholder="Apartamento/casa/bloco" 
                                {...register("complement", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:2, message:'Necessita no minímo 2 caracteres '}, onChange: (e) => {setUserAddress({...UserAddress, complement:e.target.value})}, })}
                            />

                            <ErrorMessage
                                errors={errors}
                                name="complement"
                                render={({ message }) => 
                                <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                    <strong className="font-bold">* {message}</strong>
                                </div>}
                            />
                        </div>
                    </div>
                    Ponto de referência
                    <input name="reference_point" id='reference_point' type="text" className="input input-bordered input-md w-full max-w" placeholder="Ponto de referência" 
                        {...register("reference_point", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:10, message:'Necessita no minímo 10 caracteres '}, onChange: (e) => {setUserAddress({...UserAddress, reference_point:e.target.value})}, })}
                    />

                    <ErrorMessage
                        errors={errors}
                        name="reference_point"
                        render={({ message }) => 
                        <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                            <strong className="font-bold">* {message}</strong>
                        </div>}
                    />
                    
                    <select value={UserAddress.type_of} name='type_of' id='type_of' className="select select-bordered w-full max-w-xs" {...register("type_of", {required:'Campo obrigatório.', onChange: (e) => {setUserAddress({...UserAddress, type_of:e.target.value})}})}>
                        <option value='W'>Favoritar como trabalho</option>
                        <option value='H'>Favoritar como casa</option>
                    </select>

                    <button disabled={isLoading} type='submit' className="btn btn-outline">
                        
                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Salvar endereço'}

                    </button>
                </form>
            </div>

            <button ref={ConfirmButton} onClick={()=>{onSubmit()}} className='btn btn-primary sm:btn-sm md:btn-md lg:btn-lg' id="map-button">Confirmar localização</button>
        </div>
    </div>
  )
}

export default GoogleMapComponent
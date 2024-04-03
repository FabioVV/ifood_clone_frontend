import {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUserToken } from '../../../utils/UserlocalStorage';
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';
import searchCEP from '../../../utils/CepApi';
import CurrencyInput from 'react-currency-input-field';
import { useParams } from "react-router-dom";


function EditRestaurant() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

    const { id } = useParams();


    const [isLoading, setIsLoading] = useState(false)
    const [isCepLoading, setisCepLoading] = useState(false)

    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })
    
    let navigate = useNavigate();

    const [Restaurant, setRestaurant] = useState({
        id:'',
        name:'',
        description:'',
        street:'',
        neighborhood:'',
        complement:'',
        number:'',
        city:'',
        state:'',
        zip_code:'',
        logo:'',
        banner:'',
        cnpj:'',
        delivery_fee:'',
        partner_delivery:'',
    })

    const[RestaurantCurrentImage, setRestaurantCurrentImage] = useState('')
    const[RestaurantCurrentBanner, setRestaurantCurrentBanner] = useState('')

    useEffect(()=>{
        async function getRestaurant() {
            setIsLoading(true)

            try{
                const res = await fetch(`http://127.0.0.1:8000/api/v1/restaurants/get/${id}/`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json", 
                        Authorization:` Token ${getCurrentUserToken()}`,
                    },
                })
        
                if (!res.ok) {
                    show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
                }

                
                const restaurant = await res.json()
        
    
                if(restaurant['zip_code']){
                    setRestaurant(
                        {
                            id:id,
                            name:restaurant.name,
                            description:restaurant.description,
                            street:restaurant.street,
                            neighborhood:restaurant.neighborhood,
                            complement:restaurant.complement,
                            number:restaurant.number,
                            city:restaurant.city,
                            state:restaurant.state,
                            zip_code:restaurant.zip_code,
                            cnpj:restaurant.cnpj,
                            delivery_fee:restaurant.delivery_fee,
                            partner_delivery:restaurant.partner_delivery,
                            banner:restaurant.banner,
                            
                        }
                    )
                        setRestaurantCurrentImage(restaurant.logo)
                        setRestaurantCurrentBanner(restaurant.banner)
                    
                    reset({...restaurant})
                }
    
    
            } catch(error){
                console.log(error)
    
            } finally{
                setIsLoading(false)

            }
    
        }

        if(id)getRestaurant()
    }, [id])

    



    async function onSubmit(form, event){

        event.preventDefault()
        setIsLoading(true)

        let form_data_restaurant = new FormData();



        form_data_restaurant.append("restaurant_id", Restaurant.id);

        if (Restaurant?.logo){
            form_data_restaurant.append("logo", Restaurant.logo, Restaurant.logo.name);
        }
        if (Restaurant?.banner){
            form_data_restaurant.append("banner", Restaurant.banner, Restaurant.banner.name);
        }
        form_data_restaurant.append("name", Restaurant.name);
        form_data_restaurant.append("description", Restaurant.description);
        form_data_restaurant.append("street", Restaurant.street);
        form_data_restaurant.append("neighborhood", Restaurant.neighborhood);
        form_data_restaurant.append("complement", Restaurant.complement);
        form_data_restaurant.append("city", Restaurant.city);
        form_data_restaurant.append("state", Restaurant.state);
        form_data_restaurant.append("number", Restaurant.number);
        form_data_restaurant.append("zip_code", Restaurant.zip_code);
        form_data_restaurant.append("cnpj", Restaurant.cnpj);
        form_data_restaurant.append("delivery_fee", Restaurant.delivery_fee);
        form_data_restaurant.append("partner_delivery", Restaurant.partner_delivery);

        try{

            let blank_fields = 0
            Object.entries(Restaurant).forEach(([key, val]) => {
                if(val == '' || val == undefined || val == null){
                    setError(key, {
                        type: 'blank_field',
                        message:'Campo obrigatório'
                    })
                    setIsLoading(false)
                    blank_fields++
                } else {
                    blank_fields--
                }   
            });
            

            if(blank_fields > 0){setIsLoading(false); window.scrollTo({top: 0, behavior: 'smooth'}); return false; }

            const res = await fetch("http://127.0.0.1:8000/api/v1/restaurants/update-restaurant/",{
                method:"PATCH",
                headers:{
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:form_data_restaurant,
            })

            if (!res.ok) {
                show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
            } 
            
            const restaurant_result = await res.json()

            if(restaurant_result['id']){
                show_flash_message(setShowAlert, ShowAlert, 'Restaurante atualizado com sucesso', 'alert-success')
            }            

            
        } catch(error){

            show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')

            console.log(error)
            setIsLoading(false)

        } finally {
            setIsLoading(false)

        }

    }


  return (
    <DefaultPage>
        {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

        <div className='container-user-info' style={{margin:'20px auto'}}>
            <ul style={{width:'75ch'}}>
                <li>
                    <form method='post' onSubmit={handleSubmit(onSubmit)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" encType='multipart/form-data'>
                        <label className="text-5xl mb-5"> 
                            Alteração do restaurante <span style={{fontWeight:'500'}}>{Restaurant?.name} </span>
                        </label>

                        
                        Nome
                        <input name="name" id='name' type="text" className="input input-bordered input-md w-full max-w" placeholder="Burger King" 
                            {...register("name", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, name:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        CNPJ
                        <input name="cnpj" id='cnpj' type="text" className="input input-bordered input-md w-full max-w" placeholder="17584937560004" 
                            {...register("cnpj", { maxLength:{value:14, message:'Máximo de 14 caracteres'}, minLength:{value:14, message:'Necessita no minímo 14 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, cnpj:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="cnpj"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Taxa de entrega
                        <label className="input input-bordered flex items-center gap-2">
                            
                            <CurrencyInput
                                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                id="price"
                                name="price"
                                value={Restaurant?.delivery_fee}
                                placeholder="Digite um preço"
                                decimalsLimit={2}
                                decimalSeparator="," 
                                groupSeparator="."
                                onValueChange={(value) => {setRestaurant({...Restaurant, delivery_fee:value})}}
                                {...register("price", { required: "Campo obrigatório."})}
                            />
                        </label>

                        <ErrorMessage
                            errors={errors}
                            name="delivery_fee"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Entrega parceira byteFood?
                        <select className="select select-bordered w-full max-w-xs" {...register("partner_delivery", {  required: "Campo obrigatório.", onChange: (e) => {setRestaurant({...Restaurant, partner_delivery:e.target.value})}, })}>
                            <option value={true}>Sim</option>
                            <option value={false}>Não</option>
                        </select>

                        <ErrorMessage
                            errors={errors}
                            name="partner_delivery"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />              


                        CEP
                        <div className="join">
                            <div>
                                <div>
                                    <input name="zip_code" id='zip_code' type="text" className="input input-bordered join-item input-md w-full max-w" placeholder="01002900"
                                        {...register("zip_code", { maxLength:{value:8, message:'Máximo de 8 caracteres'}, minLength:{value:8, message:'Necessita no minímo 8 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, zip_code:e.target.value})}, })}
                                    />
                                </div>
                            </div>

                            <div className="indicator">
                                {isCepLoading ? 
                                    <button className="btn join-item" type='button' disabled={isCepLoading}>Procurar <span className="loading loading-spinner loading-lg"></span></button> 
                                : 
                                    <button className="btn join-item" type='button' onClick={() =>{searchCEP(setRestaurant, Restaurant, setisCepLoading)}}>Procurar</button>
                                }

                            </div>
                        </div>

                        <ErrorMessage
                            errors={errors}
                            name="zip_code"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />
                        
                        Descrição
                        <textarea name="description" id='description' className="textarea textarea-bordered" placeholder="Restaurante de hambúrgueres"
                            {...register("description", { maxLength:{value:100, message:'Máximo de 100 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, description:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="description"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Rua
                        <input name="street" id='street' type="text" className="input input-bordered input-md w-full max-w" placeholder="Rua cubatão" 
                            {...register("street", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, street:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="street"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Bairro
                        <input name="neighborhood" id='neighborhood' type="text" className="input input-bordered input-md w-full max-w" placeholder="Parque imperial" 
                            {...register("neighborhood", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, neighborhood:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="neighborhood"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Complemento
                        <input name="complement" id='complement' type="text" className="input input-bordered input-md w-full max-w" placeholder="Ao lado do mercado fulano" 
                            {...register("complement", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, complement:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="neighborhood"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Número
                        <input name="number" id='number' type="text" className="input input-bordered input-md w-full max-w" placeholder="133" 
                            {...register("number", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:1, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, number:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="number"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Cidade
                        <input name="city" id='city' type="text" className="input input-bordered input-md w-full max-w" placeholder="São Paulo" 
                            {...register("city", { maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, city:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="city"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Estado
                        <input name="state" id='state' type="text" className="input input-bordered input-md w-full max-w" placeholder="São Paulo" 
                            {...register("state", { maxLength:{value:2, message:'Máximo de 2 caracteres'}, minLength:{value:2, message:'Necessita no minímo 2 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, state:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="state"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Logo nova
                        <input name="new_logo" id='new_logo' type="file" className="file-input w-full max-w-xs"  accept="image/jpeg,image/png,image/gif"
                            {...register("new_logo", { onChange: (e) => {setRestaurant({...Restaurant, logo:e.target.files[0]})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="new_logo"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Logo atual
                        <div id='image-container' className='rounded-lg  overflow-hidden'>
                            <img width={170} height={170} src={`http://localhost:8000${RestaurantCurrentImage}`} alt={`Imagem do restaurante ${Restaurant?.name}`} className='rounded-lg overflow-hidden'/>
                        </div>


                        Banner novo
                        <input name="banner" id='banner' type="file" className="file-input w-full max-w-xs"  accept="image/jpeg,image/png,image/gif"
                            {...register("banner", { onChange: (e) => {setRestaurant({...Restaurant, banner:e.target.files[0]})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="banner"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />      

                        Banner atual
                        <div id='image-container' className='rounded-lg  overflow-hidden'>
                            <img width={170} height={170} src={`http://localhost:8000${RestaurantCurrentBanner}`} alt={`Imagem banner do restaurante ${Restaurant?.name}`} className='rounded-lg overflow-hidden'/>
                        </div>

                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Salvar'}

                        </button>

                        <button type='button' disabled={isLoading} onClick={() => {navigate('/')}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Voltar'}
    
                        </button>
                        

                    </form>
                </li>
            </ul>
        </div>


    </DefaultPage>
  )
}

export default EditRestaurant
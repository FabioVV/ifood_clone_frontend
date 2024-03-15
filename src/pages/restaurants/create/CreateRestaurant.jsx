import React, {useState} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from '../../../utils/UserlocalStorage';
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';


function CreateRestaurant() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(false)
    const [ShowAlert, setShowAlert] = useState(false)
    let navigate = useNavigate();

    const [Restaurant, setRestaurant] = useState({
        name:'',
        description:'',
        street:'',
        neighborhood:'',
        complement:'',
        number:'',
        city:'',
        state:'',
        zip_code:''
    })
    

  return (
    <DefaultPage>
        {ShowAlert ? <Alert message='Restaurante registrado com sucesso' type='alert-success'/>: ""}

        <div className='container-user-info' style={{margin:'20px auto'}}>
            <ul style={{width:'75ch'}}>
                <li>
                    <form method='post' onSubmit={handleSubmit(()=>{alert('Restaurante criado')})} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                        <label className="text-4xl mb-5"> 
                            Criação de restaurante
                        </label>

                        Nome
                        <input name="name" id='name' type="text" className="input input-bordered input-md w-full max-w" placeholder="Burger King" 
                            {...register("name", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, name:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        CEP
                        <input name="zip_code" id='zip_code' type="text" className="input input-bordered input-md w-full max-w" placeholder="02554320" 
                            {...register("zip_code", { required: "Campo obrigatório.", maxLength:{value:8, message:'Máximo de 8 caracteres'}, minLength:{value:8, message:'Necessita no minímo 8 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, zip_code:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="zip_code"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />
                        
                        Descrição
                        <input name="description" id='description' type="text" className="input input-bordered input-md w-full max-w" placeholder="Restaurante de hambúrgueres" 
                            {...register("description", { required: "Campo obrigatório.", maxLength:{value:100, message:'Máximo de 100 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, description:e.target.value})}, })}
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
                            {...register("street", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, street:e.target.value})}, })}
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
                            {...register("neighborhood", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, neighborhood:e.target.value})}, })}
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
                        <input name="complement" id='complement' type="text" className="input input-bordered input-md w-full max-w" placeholder="Parque imperial" 
                            {...register("complement", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, complement:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="neighborhood"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Cidade
                        <input name="city" id='city' type="text" className="input input-bordered input-md w-full max-w" placeholder="São Paulo" 
                            {...register("city", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, city:e.target.value})}, })}
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
                            {...register("state", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setRestaurant({...Restaurant, state:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="state"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Criar'}

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

export default CreateRestaurant
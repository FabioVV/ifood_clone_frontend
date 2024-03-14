import React, { useEffect, useState } from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getCurrentUserToken, updateCurrentUser } from '../../../utils/UserlocalStorage';
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';

function PersonalInfo() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [ShowAlert, setShowAlert] = useState(false)

    const CurrentUser = getCurrentUser()

    const [User, SetUser] = useState({
        first_name:'',
        last_name:'',
        cpf:''
    })

    let navigate = useNavigate();


    // Populate form with user data
    useEffect(()=>{
        SetUser({
            first_name:CurrentUser['first_name'],
            last_name:CurrentUser['last_name'],
            cpf:CurrentUser['cpf']
        })
        reset({...CurrentUser})
    },[])



    async function onSubmit(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/users/edit-user-personal-data/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:JSON.stringify({
                    "id": CurrentUser['id'],
                    "first_name": User.first_name,
                    "last_name": User.last_name,
                    "cpf": User.cpf,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            } 
            
            const user_updated = await res.json()

            if(user_updated['first_name_blank']){

                setError('first_name', {
                    type: 'first_name_blank',
                    message: user_updated['first_name_blank']
                })
                setIsLoading(false)

            }

            if(user_updated['cpf_blank']){

                setError('cpf', {
                    type: 'cpf_blank',
                    message: user_updated['cpf_blank']
                })
                setIsLoading(false)

            }


            if(user_updated['first_name']){
                updateCurrentUser(User)
                show_flash_message(setShowAlert)
            }   

            setIsLoading(false)
        } catch(error){
            console.log(errors)
        }

    }


    return (
        <DefaultPage>
            {ShowAlert ? <Alert message='Dados alterados com sucesso' type='alert-success'/>: ""}
            

            <div className='container-user-info'>
                <ul>

                        <li>
                            <form method='post' onSubmit={handleSubmit(onSubmit)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                                <label className="text-4xl mb-5"> 
                                    Editar informações pessoais
                                </label>

                                Nome
                                <input name="first_name" id='first_name' type="text" className="input input-bordered input-md w-full max-w" placeholder="João" 
                                    {...register("first_name", { required: "Campo obrigatório.", maxLength:{value:25, message:'Máximo de 25 caracteres'}, minLength:{value:2, message:'Necessita no minímo 2 caracteres '}, onChange: (e) => {SetUser({...User, first_name:e.target.value})}, })}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name="first_name"
                                    render={({ message }) => 
                                    <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                        <strong className="font-bold">* {message}</strong>
                                    </div>}
                                />
                                
                                Sobrenome
                                <input name="last_name" id='last_name' type="text" className="input input-bordered input-md w-full max-w" placeholder="Souza" 
                                    {...register("last_name", { required: "Campo obrigatório.", maxLength:{value:25, message:'Máximo de 25 caracteres'}, minLength:{value:2, message:'Necessita no minímo 2 caracteres '}, onChange: (e) => {SetUser({...User, last_name:e.target.value})}, })}
                                />

                                <ErrorMessage
                                    errors={errors}
                                    name="last_name"
                                    render={({ message }) => 
                                    <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                        <strong className="font-bold">* {message}</strong>
                                    </div>}
                                />

                                CPF
                                {!CurrentUser['cpf'] ?
                                    <input name="cpf" id='cpf' type="text" className="input input-bordered input-md w-full max-w" placeholder="00000000000" 
                                        {...register("cpf", { required: "Campo obrigatório.", maxLength:{value:11, message:'Máximo de 11 caracteres'}, minLength:{value:11, message:'Necessita no minímo 11 caracteres '}, onChange: (e) => {SetUser({...User, cpf:e.target.value})}, })}
                                    />
                                :
                                    <input id='cpf' type="text" className="input input-bordered input-md w-full max-w" placeholder="00000000000" 
                                        {...register("cpf", {disabled:true,  maxLength:{value:11, message:'Máximo de 11 caracteres'}, minLength:{value:11, message:'Necessita no minímo 11 caracteres '}, })}
                                    />
                                }

                                <ErrorMessage
                                    errors={errors}
                                    name="cpf"
                                    render={({ message }) => 
                                    <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                        <strong className="font-bold">* {message}</strong>
                                    </div>}
                                />


                                <button disabled={isLoading} type='submit' className="btn btn-outline">
                                    
                                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Salvar'}

                                </button>

                                <button type='button' disabled={isLoading} onClick={() => {navigate('/minha-conta')}} className="btn btn-outline">
                                    
                                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Voltar'}
            
                                </button>
                                

                            </form>

                        </li>

                </ul>
            </div>
            
        </DefaultPage>  
  )
}



export default PersonalInfo
import React, {useState} from 'react'
import DefaultPage from '../../components/DefaultPage'
import RegisterLayout from '../../components/RegisterLayout'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import brflag from '../../public/img/brflag.svg'
import { getCurrentUser, getCurrentUserToken, setCurrentUser } from '../../utils/UserlocalStorage';

function PhoneGoogleRegister() {
    const { register, handleSubmit, setError,formState: { errors } } = useForm();

    const [PhoneConfirmed, SetPhoneConfirmed] = useState(false)
    const [CheckOTP, SetCheckOTP]     = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    let navigate = useNavigate();

    const [Phone, SetPhone] = useState(
        {
            phone:"",
            registered: false
        }
    )

    const [OTP, SetOTP] = useState(
        {
            otp:"",
        }
    )

    async function GetUserData(token){
        setIsLoading(true)
        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/@me/",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${token}`,
                },
            })
    
            if (!res.ok) {
                console.log(res.status)
            }
            
            const userData = await res.json()


            if(userData['email']){
                setCurrentUser(userData, token)

                navigate(`/`) 
                navigate(0)          
                
            }

            setIsLoading(false)

        } catch(error){
            console.log(error)

        }

    }

    async function onSubmit(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{


            const res = await fetch("http://127.0.0.1:8000/api/v1/users/authenticate/google/google-register-phone/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":getCurrentUser()['email'],
                    "phone": Phone.phone
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const sent_otp = await res.json()

            if(sent_otp['error_no_account']){

                setError('phone', {
                    type: 'error_no_account',
                    message:'Ocorreu um erro com sua solicitação. Sua conta google existe?'
                })
                setIsLoading(false)

            }


            if(sent_otp['success']){
                SetCheckOTP(true)
            }

            if(sent_otp['phone_exists']){
                setError('phone', {
                    type: 'phone_exists',
                    message:'Telefone já existente.'
                })
                setIsLoading(false)
            }

            setIsLoading(false)




        } catch(error){
            console.log(errors)
        }

    }

    async function onSubmitOTP(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/authenticate/google/google-validate-otp-phone/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":getCurrentUser()['email'],
                    "phone":Phone.phone,
                    "otp": OTP.otp
                })
            })
    
            if (!res.ok) {
                console.log(res.status)

            }

            const otp_validated = await res.json()

            if(otp_validated['phone']){
                await GetUserData(getCurrentUserToken())

            }

            if(otp_validated['error_google_account']){
                setError('otp', {
                    type: 'error_google_account',
                    message:'Um erro ocorreu durante sua solicitação. Sua conta google existe?'
                })
                setIsLoading(false)
            }

            if(otp_validated['error_login_expired_otp']){
                setError('otp', {
                    type: 'error_login_expired_otp',
                    message:'Código expirado'
                })
                setIsLoading(false)
            }

            if(otp_validated['error_login_invalid_otp']){
                setError('otp', {
                    type: 'error_login_invalid_otp',
                    message:'Código inválido'
                })
                setIsLoading(false)
            }

            setIsLoading(false)

        } catch(error){
            console.log(error)

        }

    }

    

  return (
    <DefaultPage>
        <RegisterLayout>
            {!CheckOTP ? 

                <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body gap-4 text-black">

                    Telefone
    
                    <label className="input input-bordered input-lg flex items-center gap-2">
                        <img src={brflag} width={25}/> +55 
                        <input name="phone" id='phone' type="text" className="w-full max-w grow" placeholder="49999999999" 
                            {...register("phone", { required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, onChange: (e) => {SetPhone({...Phone, phone:`+55` + e.target.value})}, })}
                        />
                    </label>
    
    
                    <ErrorMessage
                        errors={errors}
                        name="phone"
                        render={({ message }) => 
                        <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                            <strong className="font-bold">* {message}</strong>
                        </div>}
                    />
                        
                
                    <label className="text-xs mb-4"> 
    
                        Um código de acesso será enviado ao seu número de telefone.
                    
                        <br></br>
                        Não o compartilhe com ninguem.
                    </label>
    
                    <button disabled={isLoading} type='submit' className="btn btn-outline">
    
                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Continuar'}
    
                    </button>
    
                </form>
          
          :

                <form method='post' onSubmit={handleSubmit(onSubmitOTP)} style={{justifyContent:'center'}}id='form' className="card-body gap-4 text-black" >
                    <label className="text-4xl mb-5"> 
                        Código
                    </label>

                    <label className="text-md mb-4"> 
                        {`Digite o código de 6 digítos que enviamos para ${Phone.phone}`}
                    </label>


                    <input name="otp" id='otp' type="text" className="input input-bordered input-lg w-full max-w" placeholder="000000" 
                        {...register("otp", { required: "Campo obrigatório.", maxLength:{value:6, message:'Máximo de 6 caracteres'}, minLength:{value:6, message:'Necessita no minímo 6 caracteres '}, onChange: (e) => {SetOTP({...OTP, otp:e.target.value})}, })}
                    />


                    <ErrorMessage
                        errors={errors}
                        name="otp"
                        render={({ message }) => 
                        <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                            <strong className="font-bold">* {message}</strong>
                        </div>}
                    />



                    <button disabled={isLoading} type='submit' className="btn btn-outline">
                        
                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Confirmar'}

                    </button>
                    <button disabled={isLoading} onClick={() => {SetCheckOTP(false);}} className="btn btn-outline">
                        
                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                    </button>
                    
                </form>

            }


        </RegisterLayout>
    </DefaultPage>
  )
}

export default PhoneGoogleRegister
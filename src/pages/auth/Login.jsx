import React, { useState } from 'react'
import DefaultPage from '../../components/DefaultPage'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { setCurrentUser } from './utils';
import brflag from '../../public/img/brflag.svg';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLoginButton } from "react-social-login-buttons";
import hero_food from "../../public/img/hero_food.jpg";


function Login() {

    const { register, handleSubmit,setError,formState: { errors } } = useForm();

    const [EmailLogin, SetEmailLogin] = useState(false)
    const [PhoneLogin, SetPhoneLogin] = useState(false)
    const [CheckOTP, SetCheckOTP] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [Email, SetEmail] = useState(
        {
            email:"",
        }
    )
    const [Phone, SetPhone] = useState(
        {
            phone:"",
        }
    )

    const [OTP, SetOTP] = useState(
        {
            otp:"",
        }
    )


    const login_google = useGoogleLogin({
        onSuccess: async codeResponse => {
            const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${codeResponse['access_token']}`,{
                    method:"GET",
                    headers:{"Content-Type":"application/json",},
                    Authorization: `${codeResponse['token_type']} ${codeResponse['access_token']}`

                })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const google_user_data = await res.json()
        

            const res_login_backend = await fetch(`http://localhost:8000/api/v1/users/authenticate/google/`,{
                    method:"POST",
                    headers:{"Content-Type":"application/json",},

                    body:JSON.stringify({
                        "access_token": codeResponse['access_token'],
                    })
                })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const token_result = await res_login_backend.json()

            Object.assign(google_user_data, {'is_google_user':true})
            

            if(google_user_data){

                setCurrentUser(google_user_data, token_result['key'])
                window.location.replace("http://localhost:5173/");            
            }


        },
    });


    async function onSubmit(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            if(Phone.phone != ""){

                const res = await fetch("http://127.0.0.1:8000/api/v1/users/login-phone-otp/",{
                    method:"POST",
                    headers:{"Content-Type":"application/json",},
        
                    body:JSON.stringify({
                        "phone": Phone.phone
                    })
                })

                if (!res.ok) {
                    console.log(res.status)
                }
                
                const sent_otp = await res.json()
    
                if(sent_otp['error_no_phone_account']){

                    setError('phone', {
                        type: 'phone_does_not_exist',
                        message:'Este número de telefone não está associado a nenhuma conta.'
                    })
                    setIsLoading(false)

                }


                if(sent_otp['success']){
                    SetCheckOTP(true)
                    SetEmailLogin(false)
                    SetPhoneLogin(false)
                }
    
                setIsLoading(false)


            } else {
                
                const res = await fetch("http://127.0.0.1:8000/api/v1/users/login-email-otp/",{
                    method:"POST",
                    headers:{"Content-Type":"application/json",},
        
                    body:JSON.stringify({
                        "email": Email.email
                    })
                })

                if (!res.ok) {
                    console.log(res.status)
                }
                
                const sent_otp = await res.json() 


                if(sent_otp['error_email_does_not_exist']){

                    setError('email', {
                        type: 'error_email_does_not_exist',
                        message:'Este E-mail não está associado a nenhuma conta.'
                    })
        
                }
    
    
                if(sent_otp['success']){
                    SetCheckOTP(true)
                    SetEmailLogin(false)
                    SetPhoneLogin(false)
                }


    
                setIsLoading(false)

            }



        } catch(error){
            console.log(errors)
        }

    }

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
            }

            setIsLoading(false)

        } catch(error){
            console.log(error)

        }

    }

    async function onSubmitOTP(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/validate-otp/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":Email.email,
                    "phone":Phone.phone,
                    "otp": OTP.otp
                })
            })
    
            if (!res.ok) {
                console.log(res.status)

            }

            const logged = await res.json()
            if(logged['token']){
                await GetUserData(logged['token'])
                window.location.replace("http://localhost:5173/");
            }

            if(logged['error_login_expired_otp']){
                setError('otp', {
                    type: 'error_login_expired_otp',
                    message:'Código expirado.'
                })
                setIsLoading(false)
            }

            if(logged['error_login_invalid_otp']){
                setError('otp', {
                    type: 'error_login_invalid_otp',
                    message:'Código incorreto ou expirado.'
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
            

            
            {EmailLogin || PhoneLogin? 
            
                // card shrink-0 w-full max-w-sm shadow-2xl bg-base-100
                <div style={{backgroundImage:`url(${hero_food})`}} className="hero min-h-screen bg-base-200">
                    <div className="hero-overlay bg-opacity-60"></div>
                    <div className="hero-content flex-col lg:flex-row text-neutral-content">
                        <div  className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold text">Entre agora!</h1>
                            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                        </div>

                        <div className="card shrink-0 w-full max-w-lg h-max shadow-2xl bg-base-100">

                            <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body gap-4 text-black">

                                    {EmailLogin ? "Email": "Telefone"}

                                    {EmailLogin ?
                                        <>

                                            <input name="email" id='email' type="email" className="input input-bordered input-lg w-full max-w" placeholder="john@doe.com" 
                                                {...register("email", { required: "Campo obrigatório.", maxLength:{value:40, message:'Máximo de 40 caracteres'}, minLength:{value:5, message:'Necessita no minímo 5 caracteres '}, onChange: (e) => {SetEmail({...Email, email:e.target.value})}, })}
                                            />
                                                <ErrorMessage
                                                    errors={errors}
                                                    name="email"
                                                    render={({ message }) => 
                                                    <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                                        <strong className="font-bold">* {message}</strong>
                                                    </div>}
                                                />
                                        </>
                                    : 
                                        <>
                                            <label className="input input-bordered input-lg flex items-center gap-2">
                                            <img src={brflag} width={25}/> +55 
                                                <input name="phone" id='phone' type="text" className="w-full max-w grow" placeholder="49999999999" 
                                                    {...register("phone", { required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, onChange: (e) => {SetPhone({...Phone, phone:`+55` + e.target.value})}, })}
                                                />
                                            </label>

                                            {/* <input name="phone" id='phone' type="text" className="input input-bordered input-lg w-full max-w" placeholder="+5549999999999" 
                                                {...register("phone", { required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, onChange: (e) => {SetPhone({...Phone, phone:e.target.value})}, })}
                                            /> */}
                                            <ErrorMessage
                                                errors={errors}
                                                name="phone"
                                                render={({ message }) => 
                                                <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                                    <strong className="font-bold">* {message}</strong>
                                                </div>}
                                            />
                                        </>
                                    }

                                    

                                <label className="text-xs mb-4"> 
                                    {EmailLogin ? 
                                        "Um código de acesso será enviado ao seu email."
                                    : 
                                        "Um código de acesso será enviado ao seu número de telefone."
                                    }

                                    
                                    <br></br>
                                    Não o compartilhe com ninguem.
                                </label>

                                <button disabled={isLoading} type='submit' className="btn btn-outline">
                                    
                                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Continuar'}

                                </button>
                                <button disabled={isLoading} onClick={() => {SetEmailLogin(false); SetPhoneLogin(false)}} className="btn btn-outline">
                                    
                                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                                </button>
                                
                            </form>
                        </div>
                    </div>
                </div>
            
            
            :
                !CheckOTP ? 
                    <div style={{backgroundImage:`url(${hero_food})`}} className="hero min-h-screen bg-base-200">
                        <div className="hero-overlay bg-opacity-60"></div>

                        <div  className="hero-content flex-col lg:flex-row text-neutral-content">
                            <div  className="text-center lg:text-left">
                                <h1 className="mb-5 text-6xl font-bold">Entre agora!</h1>
                                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                            </div>
                            <div className="card shrink-0 w-full max-w-lg h-max shadow-2xl bg-base-100 ">
                                <form className="card-body gap-2 text-black" style={{justifyContent:'center'}}>

                                    <div className="form-control mt-1">
                                        <GoogleLoginButton onClick={() => login_google()} ></GoogleLoginButton>
                                    </div>

                                    <div className="form-control mt-2">
                                        <button onClick={() => {SetEmailLogin(true); SetPhoneLogin(false)}} type='button' className="btn btn-outline">Email</button>
                                    </div>

                                    <div className="form-control mt-2">
                                        <button onClick={() => {SetEmailLogin(false); SetPhoneLogin(true);}} type='button' className="btn btn-outline">Telefone</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                :

                    <div style={{backgroundImage:`url(${hero_food})`}} className="hero min-h-screen bg-base-200">
                            <div className="hero-overlay bg-opacity-60"></div>

                        <div  className="hero-content flex-col lg:flex-row text-neutral-content">
                            <div  className="text-center lg:text-left">
                                <h1 className="text-5xl font-bold">Entre agora!</h1>
                                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                            </div>
                            <div className="card shrink-0 w-full max-w-lg h-max shadow-2xl bg-base-100">

                                <form method='post' onSubmit={handleSubmit(onSubmitOTP)} style={{justifyContent:'center'}}id='form' className="card-body gap-4 text-black" >
                                    <label className="text-4xl mb-5"> 
                                        Código
                                    </label>

                                    <label className="text-md mb-4"> 
                                        {EmailLogin ? `Digite o código de 6 digítos que enviamos para ${Email.email}`
                                        : 
                                            `Digite o código de 6 digítos que enviamos para ${Phone.phone}`
                                        }
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
                                    <button disabled={isLoading} onClick={() => {SetCheckOTP(false); SetEmailLogin(false); SetPhoneLogin(false);}} className="btn btn-outline">
                                        
                                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                                    </button>
                                    
                                </form>
                            </div>
                        </div>
                    </div>

            }

        </DefaultPage>
  )
}

export default Login
import React, { useEffect, useState } from 'react'
import DefaultPage from '../../components/DefaultPage'
import { GoogleLoginButton } from "react-social-login-buttons";
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from './utils';

function Login() {

    const { register, handleSubmit, setError, watch, formState: { errors } } = useForm();
    let navigate = useNavigate();

    const [EmailLogin, SetEmailLogin] = useState(false)
    const [PhoneLogin, SetPhoneLogin] = useState(false)
    const [CheckOTP, SetCheckOTP] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [Email, SetEmail] = useState(
        {
            email:'',
        }
    )
    const [Phone, SetPhone] = useState(
        {
            phone:'',
        }
    )

    const [OTP, SetOTP] = useState(
        {
            otp:'',
        }
    )

    const [Loggedin, SetLoggedIn] = useState(
        {
            token:'',
        }
    )

    async function onSubmit(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/login-email-otp/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email": Email.email
                })
            })
    
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            
            const sent_otp = await res.json()


            if(sent_otp['success']){
                SetCheckOTP(true)
                SetEmailLogin(false)
                SetPhoneLogin(false)
            }

            setIsLoading(false)

        } catch(error){
            alert(error)
        }

    }

    async function GetUserData(token){
        setIsLoading(true)
        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/@me/",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${token}`,
                },
            })
    
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }
            
            const userData = await res.json()


            if(userData['email']){
                setCurrentUser(userData, token)
            }

            setIsLoading(false)

        } catch(error){
            alert(error)
        }

    }

    async function onSubmitOTP(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/validate-otp/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":Email.email,
                    "otp": OTP.otp
                })
            })
    
            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }

            const logged = await res.json()

            if(logged['token']){
                SetLoggedIn({token:logged['token']})
                GetUserData(logged['token'])
            }


            setIsLoading(false)

        } catch(error){
            alert(error)
        }

    }

    useEffect(() => {

        if (Loggedin.token != ''){
            navigate(0);navigate("/"); 
        }

     },[Loggedin.token]);

  return (
        <DefaultPage>
            {EmailLogin || PhoneLogin? 
            
            
                <div className="hero min-h-screen bg-base-200">
                    <div  className="hero-content flex-col lg:flex-row">
                        <div  className="text-center lg:text-left">
                            <h1 className="text-5xl font-bold">Entre agora!</h1>
                            <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                        </div>
                        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">

                            <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body">

                                    {EmailLogin ? "Email": "Telefone"}

                                    {EmailLogin ?
                                        <>

                                            <input name="email" id='email' type="email" className="input input-bordered input-md w-full max-w-xs" placeholder="john@doe.com" 
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
                                            <input name="phone" id='phone' type="text" className="input input-bordered input-md w-full max-w-xs" placeholder="+5549999999999" 
                                                {...register("phone", { required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, onChange: (e) => {SetPhone({...Phone, phome:e.target.value})}, })}
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
                    <div className="hero min-h-screen bg-base-200">
                        <div  className="hero-content flex-col lg:flex-row">
                            <div  className="text-center lg:text-left">
                                <h1 className="text-5xl font-bold">Entre agora!</h1>
                                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                            </div>
                            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                                <form className="card-body">

                                    <div className="form-control mt-1">
                                        <GoogleLoginButton onClick={() => alert("Hello")} />
                                    </div>

                                    <div className="form-control mt-3">
                                        <button onClick={() => SetEmailLogin(true)} type='button' className="btn btn-outline">Email</button>
                                    </div>

                                    <div className="form-control mt-3">
                                        <button onClick={() => {SetEmailLogin(false); SetPhoneLogin(true);}} type='button' className="btn btn-outline">Telefone</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                :

                    <div className="hero min-h-screen bg-base-200">
                        <div  className="hero-content flex-col lg:flex-row">
                            <div  className="text-center lg:text-left">
                                <h1 className="text-5xl font-bold">Entre agora!</h1>
                                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                            </div>
                            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">

                                <form method='post' onSubmit={handleSubmit(onSubmitOTP)} id='form' className="card-body">

                                    <label className="text-3xl mb-5"> 
                                        Código
                                    </label>
                                    <input name="otp" id='otp' type="text" className="input input-bordered input-md w-full max-w-xs" placeholder="000000" 
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


                                    <label className="text-xs mb-4"> 
                                        Digite o código de acesso que chegou no seu email para completar seu login.
                                    </label>

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
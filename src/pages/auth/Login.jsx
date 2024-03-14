import React, { useState } from 'react'
import DefaultPage from '../../components/DefaultPage'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { setCurrentUser } from '../../utils/UserlocalStorage';
import brflag from '../../public/img/brflag.svg';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import LoginLayout from '../../components/LoginLayout';



function Login() {

    const { register, handleSubmit,setError,formState: { errors } } = useForm();

    const [EmailLogin, SetEmailLogin] = useState(false)
    const [EmailLoginConfirm, SetEmailLoginConfirm] = useState(false)
    const [PhoneLogin, SetPhoneLogin] = useState(false)
    const [CheckOTP, SetCheckOTP]     = useState(false)
    const [CheckOTPConfirm, SetCheckOTPConfirm]     = useState(false)
    const [isLoading, setIsLoading]   = useState(false)

    let navigate = useNavigate()

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

    const [User, SetUser] = useState(null)
    const [UserHiddenEmail, SetUserHiddenEmail] = useState('')
    const [UserHiddenPhone, SetUserHiddenPhone] = useState('')


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

    const login_google = useGoogleLogin({
        onSuccess: async codeResponse => {

            const res_login_backend = await fetch(`http://localhost:8000/api/v1/users/authenticate/google/`,{
                method:"POST",
                headers:{"Content-Type":"application/json",},

                body:JSON.stringify({
                    "access_token": codeResponse['access_token'],
                })
            })

            const token_result = await res_login_backend.json()

            if (!res_login_backend.ok) {
                console.log(res_login_backend.status)
            }

            await GetUserData(token_result['key'])


        },
    });


    async function onSubmit(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            if(Phone.phone != ""){

                const res = await fetch("http://127.0.0.1:8000/api/v1/users/send-phone-otp/",{
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
                    SetEmailLoginConfirm(true)
                }
    
                setIsLoading(false)


            } else {
                
                const res = await fetch("http://127.0.0.1:8000/api/v1/users/send-email-otp/",{
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

            if(logged['email']){
                //await GetUserData(logged['token'])
                SetUser(logged)


                let email_name = logged['email'].substring(0, logged['email'].indexOf('@')).split('')
                let remainder_of_email = logged['email'].substring(logged['email'].indexOf('@'), logged['email'].length)
                let full_phone = logged['phone'].split('')


                for(let a = 0; a < full_phone.length; a++){
                    if(a !== full_phone.length-1 && a !== full_phone.length-2 && a !== full_phone.length-3 && a !== full_phone.length-4){
                        full_phone[a] = '*'
                    }
                }

                for(let a = 0; a < email_name.length; a++){
                    if(a !== email_name.length-1 && a !== email_name.length-2){
                        email_name[a] = '*'
                    }
                }

                SetUserHiddenEmail(email_name.join('')+remainder_of_email)
                SetUserHiddenPhone(full_phone.join(''))
                setIsLoading(false)

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

    async function onSubmitConfirmOTP(form, event){
        event.preventDefault()
        setIsLoading(true)

            try{
                const res = await fetch("http://127.0.0.1:8000/api/v1/users/send-phone-otp/",{
                    method:"POST",
                    headers:{"Content-Type":"application/json",},
        
                    body:JSON.stringify({
                        "phone": User?.phone
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
                    SetCheckOTPConfirm(true)
                }
    
                setIsLoading(false)

        } catch(error){
            console.log(error)

        }
    }

    async function onSubmitLoginPhone(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/login-user-phone/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":User?.email,
                    "phone":User?.phone,
                    "otp": OTP?.otp,
                })
            })
    
            if (!res.ok) {
                console.log(res.status)

            }

            const logged = await res.json()

            if(logged['token']){
                await GetUserData(logged['token'])

            }

            if(logged['error_mail']){
                setError('email', {
                    type: 'error_mail',
                    message:'Email incorreto.'
                })
                setIsLoading(false)
            }

            
            setIsLoading(false)

        } catch(error){
            console.log(error)

        }
    }

    async function onSubmitLoginEmail(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{


            const res = await fetch("http://127.0.0.1:8000/api/v1/users/login-user-email/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},
    
                body:JSON.stringify({
                    "email":User?.email,
                    "phone":User?.phone,
                    "otp": OTP?.otp,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const logged = await res.json()

            if(logged['token']){
                await GetUserData(logged['token'])

            }

            if(logged['error_mail']){
                setError('email', {
                    type: 'error_mail',
                    message:'Email incorreto.'
                })
                setIsLoading(false)
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
            console.log(errors)
        }

    }

  return (
    <DefaultPage>
        
        {EmailLogin || PhoneLogin? 

            <LoginLayout>

                <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body gap-4 text-black">

                    {EmailLogin ? "Email": "Telefone"}

                    {EmailLogin ?
                        <>

                            <input name="email" id='email' type="email" className="input input-bordered input-lg w-full max-w" placeholder="john@doe.com" 
                                {...register("email", { required: "Campo obrigatório.", maxLength:{value:100, message:'Máximo de 100 caracteres'}, minLength:{value:5, message:'Necessita no minímo 5 caracteres '}, onChange: (e) => {SetEmail({...Email, email:e.target.value})}, })}
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

            </LoginLayout>
        
        :
            !CheckOTP ? 

            <LoginLayout>

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

            </LoginLayout>


            :
                !User ?
                    <LoginLayout>

                        <form method='post' onSubmit={handleSubmit(onSubmitOTP)} style={{justifyContent:'center'}}id='form' className="card-body gap-4 text-black" >
                            <label className="text-4xl mb-5"> 
                                Código
                            </label>

                            <label className="text-md mb-4"> 
                                {Email.email ? `Digite o código de 6 digítos que enviamos para ${Email.email}`
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

                    </LoginLayout>
                :
                !CheckOTPConfirm ?
                    <LoginLayout>

                        <form method='post' onSubmit={EmailLoginConfirm ? handleSubmit(onSubmitLoginPhone):handleSubmit(onSubmitConfirmOTP)} style={{justifyContent:'center'}}id='form' className="card-body gap-4 text-black" >
                            
                            <label className="text-2xl mb-5"> 
                                {EmailLoginConfirm ? 
                                    <>
                                        <span>Para sua segurança, digite novamente o seu e-mail:</span><br/>
                                        {UserHiddenEmail}
                                    </>
                                :
                                    <>
                                    
                                        <span>Agora é só confirmar o seu celular</span><br/>
                                        <span style={{fontSize:'0.74em'}}>Clique em confirmar para receber o código no seu telefone</span>
                                    </>
                                }
                            </label>
                                    
                            {EmailLoginConfirm ? 
                                <>
                                    <input name="email_confirm_login" id='email_confirm_login' type="email" className="input input-bordered input-lg w-full max-w" placeholder="john@doe.com" 
                                    {...register("email_confirm_login", { required: "Campo obrigatório.", maxLength:{value:100, message:'Máximo de 100 caracteres'}, minLength:{value:5, message:'Necessita no minímo 5 caracteres '}, onChange: (e) => {SetUser({...User, email:e.target.value})}, })}
                                    />
                                    <ErrorMessage
                                        errors={errors}
                                        name="email_confirm_login"
                                        render={({ message }) => 
                                        <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                            <strong className="font-bold">* {message}</strong>
                                        </div>}
                                    />
                                </>
                            :
                                <>
                                    <label style={{backgroundColor:'lightgray'}} className="input input-bordered input-lg flex items-center gap-2">
                                        <img src={brflag} width={25}/> +55 
                                        <input name="phone_confirm_login" id='phone_confirm_login' type="text" value={UserHiddenPhone} className="w-full max-w grow" placeholder="49999999999" 
                                            {...register("phone_confirm_login", { disabled:true, required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, })}
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
                                </>
                            }
                                



                            <button disabled={isLoading} type='submit' className="btn btn-outline">
                                
                                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Confirmar'}

                            </button>
                            <button disabled={isLoading} onClick={() => {SetCheckOTP(false); SetEmailLogin(false); SetPhoneLogin(false);}} className="btn btn-outline">
                                
                                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                            </button>
                            
                        </form>

                    </LoginLayout>
                :
                    <LoginLayout>

                        <form method='post' onSubmit={handleSubmit(onSubmitLoginEmail)} style={{justifyContent:'center'}}id='form' className="card-body gap-4 text-black" >
                            <label className="text-4xl mb-5"> 
                                Código
                            </label>

                            <label className="text-md mb-4"> 
                                {EmailLogin ? `Digite o código de 6 digítos que enviamos para ${User?.email}`
                                : 
                                    `Digite o código de 6 digítos que enviamos para ${UserHiddenPhone}`
                                }
                            </label>


                            <input name="otp_login" id='otp_login' type="text" className="input input-bordered input-lg w-full max-w" placeholder="000000" 
                                {...register("otp_login", { required: "Campo obrigatório.", maxLength:{value:6, message:'Máximo de 6 caracteres'}, minLength:{value:6, message:'Necessita no minímo 6 caracteres '}, onChange: (e) => {SetOTP({...OTP, otp:e.target.value})}, })}
                            />


                            <ErrorMessage
                                errors={errors}
                                name="otp_login"
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

                    </LoginLayout>

        }

    </DefaultPage>
  )
}

export default Login
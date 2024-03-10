import {React, useState} from 'react'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLoginButton } from "react-social-login-buttons";
import { setCurrentUser } from '../../utils/UserlocalStorage';
import hero_food from "../../public/img/hero_food.jpg";
import brflag from '../../public/img/brflag.svg'
import DefaultPage from '../../components/DefaultPage'
import RegisterLayout from '../../components/RegisterLayout';


function Register() {

  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  let navigate = useNavigate();

  
  const [EmailRegister, SetEmailRegister] = useState(true) // MANTER COMO TRUE PARA ENTRAR DIRETO NO REGISTER EMAIL
  const [PhoneRegister, SetPhoneRegister] = useState(false)

  const [CheckOTPemail, SetCheckOTPmail] = useState(false)
  const [CheckOTPphone, SetCheckOTPphone] = useState(false)
  
  const [RegisterUser, SetRegisterUser] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const [Email, SetEmail] = useState(
    {
        email:"",
        registered: false
    }
  )
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

  const [User, SetUser] = useState(
        {
            cpf:"",
            first_name:"",
            last_name:""

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

            if(Email.registered != false){

                const res = await fetch("http://127.0.0.1:8000/api/v1/users/register-phone/",{
                    method:"PATCH",
                    headers:{"Content-Type":"application/json",},
        
                    body:JSON.stringify({
                        "phone": Phone.phone,
                        "email": Email.email
                    })
                })

                if (!res.ok) {
                console.log(res.status)
                }
                
                const sent_otp = await res.json()

                if(sent_otp['error_phone_exists']){

                setError('phone', {
                    type: 'error_phone_exists',
                    message:'Telefone já cadastrado.'
                })
                setIsLoading(false)
                
            }


                if(sent_otp['success']){
                    SetCheckOTPphone(true)

                    SetEmailRegister(true)
                    SetPhoneRegister(true)
                    SetRegisterUser(true)
                }

                setIsLoading(false)


            } else {
                
                const res = await fetch("http://127.0.0.1:8000/api/v1/users/register-email/",{
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


                if(sent_otp['error_email_exists']){

                setError('email', {
                    type: 'error_email_exists',
                    message:'Endereço de email já cadastrado.'
                })
                setIsLoading(false)
    
                }


                if(sent_otp['success']){
                SetCheckOTPmail(true)

                SetEmailRegister(true)
                SetPhoneRegister(true)
                SetRegisterUser(true)
                }


                setIsLoading(false)

            }



        } catch(error){
            console.log(error)
        }

    }

    async function onSubmitOTPemail(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/validate-otp-email-register/",{
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

            const success_email = await res.json()

            if(success_email['error_does_not_exist']){

                setError('otp_email', {
                    type: 'error_does_not_exist',
                    message:'Endereço de E-mail inválido.'
                })
                setIsLoading(false)
    
            }

            
            if(success_email['error_invalid_otp']){

                setError('otp_email', {
                    type: 'error_does_not_exist',
                    message:'Código de confirmação errado.'
                })
                setIsLoading(false)
    
            }


            if(success_email['success']){

            SetCheckOTPmail(false)
            SetEmail({...Email, registered:true})

            }

            setIsLoading(false)

        } catch(error){
            console.log(error)
        }

    }

    async function onSubmitOTPphone(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/validate-otp-phone-register/",{
                method:"POST",
                headers:{"Content-Type":"application/json",},

                body:JSON.stringify({
                    "phone":Phone.phone,
                    "otp": OTP.otp
                })
            })

            if (!res.ok) {
                throw new Error(`${res.status} ${res.statusText}`);
            }

            const success_phone = await res.json()

            
            if(success_phone['error_does_not_exist']){

                setError('otp_phone', {
                    type: 'error_does_not_exist',
                    message:'Número de telefone inválido.'
                })
                setIsLoading(false)
    
            }

            
            if(success_phone['error_invalid_otp']){

                setError('otp_phone', {
                    type: 'error_invalid_otp',
                    message:'Código de confirmação errado.'
                })
                setIsLoading(false)
    
            }


            if(success_phone['success']){

            SetCheckOTPphone(false)
            SetPhone({...Phone, registered:true})

            }
            setIsLoading(false)

        } catch(error){
            console.log(error)
        }

    }

    async function onSubmitCreateUser(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{
            const res = await fetch("http://127.0.0.1:8000/api/v1/users/register-user/",{
                method:"PATCH",
                headers:{"Content-Type":"application/json",},

                body:JSON.stringify({
                    "cpf": User.cpf,
                    "first_name": User.first_name,
                    "last_name": User.last_name,
                    "email": Email.email
                })
            })

            if (!res.ok) {
            console.log(`${res.status} ${res.statusText}`);
            }

            const user_created = await res.json()

            if(user_created['cpf']){

            setError('cpf', {
                type: 'cpf_too_big',
                message:'Máximo de 11 caracteres.'
            })

            setIsLoading(false)

            }

            if(user_created['first_name']){

            SetCheckOTPphone(false)
            SetPhone({...Phone, registered:true})
            navigate("/login"); 

            }
            setIsLoading(false)

        } catch(error){
            console.log(error)
        }

    }


return (
    <DefaultPage>

          {!EmailRegister && !PhoneRegister ?  

            <RegisterLayout>

                <form className="card-body gap-2 text-black" style={{justifyContent:'center'}}>
                    <div className="form-control mt-1">
                        <GoogleLoginButton onClick={() => alert("Hello")} />
                    </div>

                    <div className="form-control mt-2">
                        <button onClick={() => SetEmailRegister(true)} type='button' className="btn btn-outline">Email</button>
                    </div>

                    <div className="form-control mt-2">
                        <button onClick={() => {SetEmailRegister(false); SetPhoneRegister(true);}} type='button' className="btn btn-outline">Telefone</button>
                    </div>
                </form>

            </RegisterLayout>

          : 

            !RegisterUser ? 
                
                <RegisterLayout>

                    <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body gap-4 text-black">
                                
                                <div className="form-control mt-1">
                                    <GoogleLoginButton onClick={() => login_google()} ></GoogleLoginButton>
                                </div>

                                {EmailRegister ? "Email": "Telefone"}

                                {EmailRegister ?
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
                                {EmailRegister ? 
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
                            {/* <button disabled={isLoading} onClick={() => {SetEmailRegister(false); SetPhoneRegister(false)}} className="btn btn-outline">
                                
                                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                            </button> */}
                            
                    </form>

                </RegisterLayout>

              :   

              CheckOTPemail ?  

                <RegisterLayout>

                    <form method='post' onSubmit={handleSubmit(onSubmitOTPemail)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                            <label className="text-4xl mb-5"> 
                                Código
                            </label>

                            <label className="text-md mb-4"> 
                                {EmailRegister ? `Digite o código de 6 digítos que enviamos para ${Email.email}`
                                : 
                                null
                                }
                            </label>


                            <input name="otp_email" id='otp_email' type="text" className="input input-bordered input-lg w-full max-w" placeholder="000000" 
                                {...register("otp_email", { required: "Campo obrigatório.", maxLength:{value:6, message:'Máximo de 6 caracteres'}, minLength:{value:6, message:'Necessita no minímo 6 caracteres '}, onChange: (e) => {SetOTP({...OTP, otp:e.target.value})}, })}
                            />


                            <ErrorMessage
                                errors={errors}
                                name="otp_email"
                                render={({ message }) => 
                                <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                    <strong className="font-bold">* {message}</strong>
                                </div>}
                            />



                            <button disabled={isLoading} type='submit' className="btn btn-outline">
                                
                                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Confirmar'}

                            </button>
                            {/* <button disabled={isLoading} onClick={() => {SetCheckOTPmail(false); SetEmailRegister(false); SetPhoneLogin(false);}} className="btn btn-outline">
                                
                                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                            </button> */}
                            
                    </form>

                </RegisterLayout>

                :
                CheckOTPphone ?

                    <RegisterLayout>

                    <form method='post' onSubmit={handleSubmit(onSubmitOTPphone)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                        <label className="text-4xl mb-5"> 
                            Código - Telefone
                        </label>

                        <label className="text-md mb-4"> 
                            {PhoneRegister ? `Digite o código de 6 digítos que enviamos para ${Phone.phone}`
                            : 
                                null
                            }
                        </label>


                        <input name="otp_phone" id='otp_phone' type="text" className="input input-bordered input-lg w-full max-w" placeholder="000000" 
                            {...register("otp_phone", { required: "Campo obrigatório.", maxLength:{value:6, message:'Máximo de 6 caracteres'}, minLength:{value:6, message:'Necessita no minímo 6 caracteres '}, onChange: (e) => {SetOTP({...OTP, otp:e.target.value})}, })}
                        />


                        <ErrorMessage
                            errors={errors}
                            name="otp_phone"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />



                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Confirmar'}

                        </button>
                        {/* <button disabled={isLoading} onClick={() => {SetCheckOTPmail(false); SetEmailRegister(false); SetPhoneLogin(false);}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                        </button> */}
                        
                    </form>

                    </RegisterLayout>
                  
                :
                  !Phone.registered ? 
                  <RegisterLayout>

                    <form method='post' onSubmit={handleSubmit(onSubmit)} id='form' className="card-body gap-4 text-black">
                        <label className="text-4xl mb-5"> 
                            Tudo certo com seu email!
                        </label>
                        <label className="text-4xl mb-5"> 
                            Agora confirmaremos seu número de telefone
                        </label>
                            {CheckOTPphone ? "Email": "Telefone"}

                            {CheckOTPphone ?
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
                            {EmailRegister ? 
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
                        {/* <button disabled={isLoading} onClick={() => {SetEmailRegister(false); SetPhoneRegister(false)}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                        </button> */}
                        
                    </form>

                  </RegisterLayout>



                  :
                  <RegisterLayout>

                    <form method='post' onSubmit={handleSubmit(onSubmitCreateUser)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                        <label className="text-4xl mb-5"> 
                            Tudo certo com seu telefone!
                        </label>
                        <label className="text-4xl mb-5"> 
                            Agora preencha seus dados
                        </label>


                        CPF
                        <input name="cpf" id='cpf' type="text" className="input input-bordered input-lg w-full max-w" placeholder="00000000000" 
                            {...register("cpf", { required: "Campo obrigatório.", pattern: {
                                value: /^([0-9]{2}[.]?[0-9]{3}[.]?[0-9]{3}[/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[.]?[0-9]{3}[.]?[0-9]{3}[-]?[0-9]{2})$/i,
                                message: "CPF inválido"
                            } , valueAsNumber:true, maxLength:{value:11, message:'Máximo de 11 caracteres'}, minLength:{value:11, message:'Necessita no minímo 11 caracteres '}, onChange: (e) => {SetUser({...User, cpf:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="cpf"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />


                        Nome
                        <input name="first_name" id='first_name' type="text" className="input input-bordered input-lg w-full max-w" placeholder="João" 
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
                        <input name="last_name" id='last_name' type="text" className="input input-bordered input-lg w-full max-w" placeholder="Souza" 
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



                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Criar conta'}

                        </button>
                        {/* <button disabled={isLoading} onClick={() => {SetCheckOTPmail(false); SetEmailRegister(false); SetPhoneLogin(false);}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Retornar'}

                        </button> */}
                        
                    </form>

                  </RegisterLayout>


        
          }




    </DefaultPage>    
  )
}


export default Register

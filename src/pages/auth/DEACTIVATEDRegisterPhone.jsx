import {React, useEffect, useState} from 'react'
import DefaultPage from '../../components/DefaultPage'
import { GoogleLoginButton } from "react-social-login-buttons";
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from './utils';
import brflag from '../../public/img/brflag.svg'


function RegisterPhone() {

  const { register, handleSubmit, setError, formState: { errors } } = useForm();
  let navigate = useNavigate();


  
  const [EmailRegister, SetEmailRegister] = useState(false)
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
        alert(error)
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

            setError('otp', {
                type: 'error_does_not_exist',
                message:'Endereço de E-mail inválido.'
            })
            setIsLoading(false)
  
        }

          
        if(success_email['error_invalid_otp']){

            setError('otp', {
                type: 'error_does_not_exist',
                message:'Código de confirmação errado.'
            })
            setIsLoading(false)
  
        }


        if(success_email['success']){

          SetCheckOTPmail(false)
          SetEmail({...Email, registered:true})
          document.getElementById('otp').value = ''

        }

        setIsLoading(false)

    } catch(error){
        alert(error)
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

            setError('otp', {
                type: 'error_does_not_exist',
                message:'Número de telefone inválido.'
            })
            setIsLoading(false)
  
        }

          
        if(success_phone['error_invalid_otp']){

            setError('otp', {
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
        alert(error)
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
            throw new Error(`${res.status} ${res.statusText}`);
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
        alert(error)
    }

}



  return (
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

  )
}


export default RegisterPhone

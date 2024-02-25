import {React, useState} from 'react'
import DefaultPage from '../../components/DefaultPage'
import { GoogleLoginButton } from "react-social-login-buttons";
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from './utils';
import brflag from '../../public/img/brflag.svg'

function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();


  const [EmailLogin, SetEmailRegister] = useState(false)
  const [PhoneLogin, SetPhoneRegister] = useState(false)
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


  return (
    <DefaultPage>

      <div className="hero min-h-screen bg-base-200">
          <div  className="hero-content flex-col lg:flex-row">
              <div  className="text-center lg:text-left">
                  <h1 className="text-5xl font-bold">Registre-se agora!</h1>
                  <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
              </div>
              <div className="card shrink-0 w-full max-w-lg h-max shadow-2xl bg-base-100">
                  <form className="card-body gap-2" style={{justifyContent:'center'}}>

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
              </div>
          </div>
      </div>
      
    </DefaultPage>    
  )
}


export default Register





            // if(sent_otp['email_exists']){

            //     setError('email', {
            //       type: 'email_already_registered',
            //       message:'Já existe cadastro para este Email.'
            //     })
        
            // }

            // if(sent_otp['phone_exists']){

            //     setError('email', {
            //       type: 'phone_already_registered',
            //       message:'Já existe cadastro para este telefone.'
            //     })
        
            // }

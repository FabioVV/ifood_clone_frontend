import React, {useState, useEffect} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUser, updateCurrentUser, getCurrentUserToken } from '../../../utils/UserlocalStorage';
import brflag from '../../../public/img/brflag.svg';

import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';



function ChangePhone() {

    const {register, handleSubmit, reset, setError, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })  

    const [User, SetUser] = useState({
        phone:'',
    })


    const [OTP, SetOTP] = useState(
        {
            otp:"",
        }
    )

    const CurrentUser = getCurrentUser()

    let navigate = useNavigate();


    useEffect(()=>{
        SetUser({phone:CurrentUser['phone']})
        // reset({...CurrentUser})
    },[])



    async function onSubmitChangePhone(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/users/edit-user-phone/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },

                body:JSON.stringify({
                    "id":CurrentUser['id'],
                    "phone":User.phone,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const result = await res.json()

            if(result['success']){
                document.getElementById('my_modal_1').showModal()
            }

            if(result['user_does_not_exist']){
                setError('phone', {
                    type: 'user_does_not_exist',
                    message:'Ocorreu um erro com sua solicitação.'
                })
                setIsLoading(false)
            }

            setIsLoading(false)

        } catch(error){
            console.log(errors)
        }

    }

    async function onSubmitChangePhoneConfirm(form, event){
        event.preventDefault()
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/users/edit-user-phone-confirm/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:JSON.stringify({
                    "id":CurrentUser['id'],
                    "otp":OTP.otp,
                    "phone":User.phone,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const result = await res.json()

            if(result['phone']){

                updateCurrentUser(User)
                document.getElementById('mybutton_form_otp_modal_1').click()
                show_flash_message(setShowAlert, ShowAlert, 'Celular atualizado com sucesso', 'alert-success')

            }

            // if(result['user_does_not_exist']){
            //     setError('email', {
            //         type: 'user_does_not_exist',
            //         message:'Ocorreu um erro com sua solicitação.'
            //     })
            //     setIsLoading(false)
            // }

            setIsLoading(false)

        } catch(error){
            console.log(errors)
        }

    }


  return (
    <DefaultPage>
        {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

        <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Código</h3>
                        <br></br>
                        <label className="text-lg mb-4"> 

                            Digite o código de 6 digítos que enviamos para <span className='font-bold'>{User.phone}</span>
                            
                        </label>

                    <form method='post' onSubmit={handleSubmit(onSubmitChangePhoneConfirm)} style={{justifyContent:'center'}} id='form-confirm' name='form-confirm' className="card-body gap-4 text-black" >

                        OTP
                        <input name="otp" id='otp' type="text" className="input input-bordered input-lg w-full max-w" placeholder="000000" 
                            {...register("otp", {  maxLength:{value:6, message:'Máximo de 6 caracteres'}, minLength:{value:6, message:'Necessita no minímo 6 caracteres '}, onChange: (e) => {SetOTP({...OTP, otp:e.target.value})}, })}
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
                    </form>

                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn" id='mybutton_form_otp_modal_1'>Fechar</button>
                    </form>
                </div>
            </div>
        </dialog>

        <div className='container-user-info'>
            <ul className=''>

                <li>
                    <form method='post' onSubmit={handleSubmit(onSubmitChangePhone)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" >
                        <label className="text-4xl mb-5"> 
                            Editar informações pessoais
                        </label>

                        <label className="input input-bordered input-lg flex items-center gap-2">
                            <img src={brflag} width={25}/> +55 
                            {/* SLICE 3 NO VALOR PQ ESTÁ HARDCODED O +55 DO BRASIL (SÓ FUNCIONA COM NÚMEROS BRASILEIROS) */}
                            <input name="phone" id='phone' type="text" className="w-full max-w grow" placeholder="49999999999" value={CurrentUser['phone'].slice(3)}
                                {...register("phone", { required: "Campo obrigatório.", maxLength:{value:15, message:'Máximo de 15 caracteres'}, minLength:{value:7, message:'Necessita no minímo 7 caracteres '}, onChange: (e) => {SetUser({...User, phone:'+55'+ e.target.value})}, })}
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

                        <label className="text-sm mb-3"> 
                            <span className='font-bold' style={{color:'green'}}>Confirmado</span> em <span className=''>{CurrentUser?.phone_confirmed_in}</span>
                        </label>


                    

                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Salvar'}

                        </button>

                        <button type='button' disabled={isLoading} onClick={() => {navigate('/minha-conta/dados-de-contato')}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Voltar'}
    
                        </button>
                        

                    </form>

                </li>

            </ul>
        </div>

    </DefaultPage>
  )
}

export default ChangePhone
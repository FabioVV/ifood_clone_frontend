import React, {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';
import { updateCurrentUser } from '../../../utils/UserlocalStorage';
import { getCurrentUser, getCurrentUserToken } from '../../../utils/UserlocalStorage';

function Publicity() {

  let navigate = useNavigate();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  const [isLoading, setIsLoading] = useState(false)

  const [ShowAlert, setShowAlert] = useState({
      show: false,
      message:'',
      type:'',
  })

  let user_ads = getCurrentUser()
  
  const[Receive_ads, SetReceive_ads] = useState({
    receive_ads: false
  })

  const handleCheckboxChange = (event) => {
    SetReceive_ads({...Receive_ads, receive_ads:event.target.checked});

    document.getElementById('btn-sub').click()
  };

  useEffect(()=>{
    SetReceive_ads({Receive_ads:user_ads['receive_ads']})
    reset({...user_ads})
  },[])


  async function onSubmit(form, event){
    event.preventDefault()
    setIsLoading(true)


    try{

        const res = await fetch("http://127.0.0.1:8000/api/v1/users/publicity-optin/",{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json", 
                Authorization:` Token ${getCurrentUserToken()}`,
            },

            body:JSON.stringify({
                "id":getCurrentUser()['id'],
                "receive_ads":Receive_ads?.receive_ads,
            })
        })

        if (!res.ok) {
            console.log(res.status)
        }
        
        const result = await res.json()

        if(result['email']){

            updateCurrentUser(Receive_ads)
            show_flash_message(setShowAlert, ShowAlert, 'Dados atualizados', 'alert-success')

        }

        setIsLoading(false)

    } catch(error){
        console.log(errors)
    }

}

  return (
    <DefaultPage>
        {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

      <div className='container-user-info' style={{width:'60ch', margin:'24px auto'}}>
        <ul className='ul-user'>

            <li style={{marginBottom:'2.5rem'}}>
              <div className='user-info-edit'>
                <strong>
                  <h1 className='user_data_title' >Escolha se você quer receber anúncios fora do byteFood</h1>
                  <span style={{color: '#717171'}}>
                    Os anúncios são apresentados em sites e apps de terceiros que utilizam o 
                    nosso serviço de publicidade. O anunciante define seu público-alvo, 
                    sem acesso a seus dados pessoais.
                  </span>
                </strong>
              </div>
            </li>



            <li className='data-user'>
              <div className='user-info-edit'>
                <form id='form' action="" onSubmit={handleSubmit(onSubmit)}>
                  <button className='hidden' type='submit' id='btn-sub'></button>
                  <strong className='user_list_data_title'>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Quero receber anúncios de terceiros</span> 
                        <input type="checkbox" className="toggle" name='receive_ads' id='receive_ads' checked={Receive_ads.receive_ads}
                          {...register("receive_ads", { onChange: (e) => {handleCheckboxChange(e)}, })}
                        />
                      </label>
                    </div>
                  </strong>
                </form>
                <span className='user-info-data'>

                </span>
                
              </div>
            </li>
            <button style={{marginTop:'2rem'}} type='button' onClick={() => {navigate('/minha-conta')}} className="btn btn-outline">      
              Voltar
            </button>
        </ul>
      </div>

    </DefaultPage>
  )
}

export default Publicity
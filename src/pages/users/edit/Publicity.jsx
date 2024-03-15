import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useNavigate } from "react-router-dom";


function Publicity() {

  let navigate = useNavigate();


  return (
    <DefaultPage>

      <div className='container-user-info' style={{width:'60ch', margin:'24px auto'}}>
        <ul className='ul-user'>

            <li style={{marginBottom:'2.5rem'}}>
              <div className='user-info-edit'>
                <strong>
                  <h1 className='user_data_title' >Escolha se você quer receber anúncios fora do iFood</h1>
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

                <strong className='user_list_data_title'>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Quero receber anúncios de terceiros</span> 
                      <input type="checkbox" className="toggle" name='' />
                    </label>
                  </div>
                </strong>

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
import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { getCurrentUser } from '../../../utils/UserlocalStorage'
import { useNavigate } from "react-router-dom";

function Credentials() {

  const User = getCurrentUser()
  let navigate = useNavigate();


  return (
    <DefaultPage>
      
      <div className='container-user-info'>
        <ul className='ul-user'>

            <li style={{marginBottom:'2.5rem'}}>
              <div className='user-info-edit'>
                <strong>
                  <h1 className='user_data_title' >Meus dados</h1>
                  <span style={{color: '#717171'}}>Veja aqui suas informações de acesso à conta byteFood</span>
                </strong>
              </div>
            </li>

            <li className='data-user'>
              <div className='user-info-edit'>
                <strong className='user_list_data_title'>
                  Email
                </strong>
                <span className='user-info-data'>
                  {User?.email}
                </span>
                <span className='user-info-data'>
                  <span style={{color:'green'}}>Confirmado</span> em {User?.email_confirmed_in ? User?.email_confirmed_in: User?.created_at}
                </span>
              </div>
            </li>

            <li className='data-user'>
              <div className='user-info-edit'>
                <strong className='user_list_data_title'>
                  Celular
                </strong>
                <span className='user-info-data'>
                  {User?.phone}
                </span>
                <span className='user-info-data'>

                  {User?.phone_confirmed_in ? 
                      <>
                          <span style={{color:'green'}}>Confirmado</span> <span>em {User?.phone_confirmed_in}</span>
                      </>
                  :
                      <>
                          <span style={{color:'salmon'}}>Não Confirmado</span> 
                      </>
                  }
                </span>

                  <button style={{marginTop:'2rem'}} type='button' onClick={() => {navigate('/minha-conta')}} className="btn btn-outline">
                          
                      Voltar

                  </button>
              </div>
            </li>

        </ul>
      </div>

    </DefaultPage>
  )
}

export default Credentials
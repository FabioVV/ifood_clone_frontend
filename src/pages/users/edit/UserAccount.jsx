import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useNavigate } from "react-router-dom";

function UserAccount() {

  let navigate = useNavigate();

  return (
    <DefaultPage>
      
        <div className='container-user-info'>
          <ul className='ul-user'>

              <li style={{marginBottom:'2.5rem'}}>
                <div className='user-info-edit'>
                  <strong>
                    <h1 className='user_data_title' >Meus dados</h1>
                  </strong>
                </div>
              </li>

              <li className='data-user' onClick={() =>{navigate('informacoes-pessoais')}}>
                <div className='user-info-edit'>
                  <strong className='user_list_data_title'>
                    Informações pessoais
                  </strong>
                  <span className='user-info-data'>
                    Nome completo e CPF
                  </span>
                </div>
                <span className='arrow'>
                  &gt;
                </span>
              </li>

              <li className='data-user'>
                <div className='user-info-edit'>
                  <strong className='user_list_data_title'>
                    Dados de contato
                  </strong>
                  <span className='user-info-data'>
                    E-mail e Telefone
                  </span>
                </div>
                <span className='arrow'>
                  &gt;
                </span>
              </li>

              <li className='data-user'>
                <div className='user-info-edit'>
                  <strong className='user_list_data_title'>
                    Credenciais
                  </strong>
                  <span className='user-info-data'>
                    Meios de acesso a minha conta
                  </span>
                </div>
                <span className='arrow'>
                  &gt;
                </span>
              </li>

              <li className='data-user'>
                <div className='user-info-edit'>
                  <strong className='user_list_data_title'>
                    Publicidade
                  </strong>
                  <span className='user-info-data'>
                    Gerenciar permissão
                  </span>
                </div>
                <span className='arrow'>
                  &gt;
                </span>
              </li>

          </ul>
        </div>

    </DefaultPage>
    
  )
}

export default UserAccount
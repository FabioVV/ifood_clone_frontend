import React from 'react'
import DefaultPage
 from '../../../components/DefaultPage'

function UserAccount() {
  return (
    <DefaultPage>

        <div>
          <div className='container-user-info'>
            <ul className='ul-user'>

                <li>
                  <div className='user-info-edit'>
                    <strong>
                      <h1 style={{fontSize:'1.5em', paddingBottom:'1rem'}}>Meus dados</h1>
                    </strong>
                  </div>
                </li>

                <li className='data-user'>
                  <div className='user-info-edit'>
                    <strong>
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
                    <strong>
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
                    <strong>
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
                    <strong>
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
        </div>
    </DefaultPage>
    
  )
}

export default UserAccount
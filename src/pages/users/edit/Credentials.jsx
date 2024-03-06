import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { getCurrentUser } from '../../auth/utils'

function Credentials() {

    const User = getCurrentUser()
    console.log(User)
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
                    <span style={{color:'green'}}>Confirmado</span> em {User?.email_confirmed_in ? User?.email_confirmed_in: User?.date_joined}
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
                    <span style={{color:'green'}}>Confirmado</span> em {User?.phone_confirmed_in}
                  </span>
                </div>
              </li>

          </ul>
        </div>
    </DefaultPage>
  )
}

export default Credentials
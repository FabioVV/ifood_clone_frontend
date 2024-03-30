import React,{useState, useEffect} from 'react'
import { getCurrentUser, getCurrentUserToken } from '../../../utils/UserlocalStorage'

import work_cup from '../../../public/img/work-cup.png'
import house from '../../../public/img/house.png'



function Address({address, handle_fetch}) {
  const [User, SetUser] = useState(getCurrentUser) 
  
  
  return (
    <div id='address-container'>
      <div id={`address`} className={`m-3 z-1 ${address.is_selected ? 'address-selected': ''}`} onClick={()=>{}}>
        <div id='address-icone'>
          
          {(() => {
            switch (address.type_of) {
              case 'H':
                return <img width={60} height={60} src={house} alt="imagem casa dos enderecos" />;
              case 'W':
                return <img width={60} height={60} src={work_cup} alt="imagem trabalho dos enderecos" />;
              default:
                return <img width={60} height={60} src={house} alt="imagem padrao dos enderecos" />;
            }
          })()}

        </div>

        <div className='p-3' id='address-info'>
            <h4 id='address-info-title'>{address?.street}</h4> {/*{- TROCAR POR NOME ou MANTER caso nao seja casa ou trabalho} */}
            <span id='address-info-all'>{address?.street}, {address?.neighborhood}, {address?.number}, {address?.city} - {address?.state}</span>
        </div>

      </div>
      <div id='address-elp' onClick={()=>{alert('b')}}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </div>
    </div>
  )
}

export default Address
import React,{useState, useEffect} from 'react'
import { getCurrentUser, getCurrentUserToken } from '../../../utils/UserlocalStorage'

import work_cup from '../../../public/img/work-cup.png'
import house from '../../../public/img/house.png'
import DeleteAddress from '../../../components/DeleteAddressModal'

function Address({address, HandleFetch, excludeDel}) {
  const [User, SetUser] = useState(getCurrentUser) 
  const [isLoading, setIsLoading] = useState(false)

  function onSubmitSetNewActiveAddress(){
    
    try{

      (async(url = 'http://127.0.0.1:8000/api/v1/addresses/select-active/')=>{

        const response = await fetch(url, {
          method:'POST',
          headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},

          body:JSON.stringify({
            "user_id":User?.id,
            "address_id":address?.id,
          })

        })
    
        if(response.ok){
          const data = await response.json()
          HandleFetch()
        } 

      })()

    } catch(e){
      console.log(e.message)

    } finally {
      setIsLoading(false)

    }


  }
  
  return (
    <div id='address-container'>
        <div id={`address`} className={`m-3 z-1 ${address.is_selected ? 'address-selected': ''}`} onClick={()=>{onSubmitSetNewActiveAddress()}}>
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

      <div id='address-elp' style={{display: excludeDel ? "none":""}}>
        <div className="dropdown dropdown-left dropdown-end">
          <i tabIndex={0} role="button" className="fa-solid fa-ellipsis-vertical"></i>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {/* <li><a>Editar Endereço</a></li> */}
            <li><a onClick={() => {document.getElementById(`my_modal_delete_address_${address?.id}`)?.showModal()}}>Excluir endereço</a></li>
            <DeleteAddress HandleFetch={HandleFetch} address_id={address?.id} />
          </ul>
        </div>
      </div>

    </div>
  )
}

export default Address
import React from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import DeleteRestaurant from './DeleteRestaurantModal'


function Restaurant({restaurant, HandleFetch}) {

  return (
    <>
      <div id='image-container' className='rounded-lg  overflow-hidden'>
        <img width={135} height={135} src={`http://localhost:8000${restaurant?.logo}`} alt={`Imagem do restaurante ${restaurant?.name}`} className='rounded-lg overflow-hidden'/>
      </div>

      <div id="content">
        <h3 id='title'>

          <div id='title-header'>
            <span id='title-name'>{restaurant?.name}</span>
          </div>
          
        </h3>

        <div id='title-info'>

            {/* <span id='rating'>
                <span>
                  imagem estrela
                </span>
                  4.5
                </span> 
              </span> 
            */}
            <span id='separator'>•</span>
            <span>{restaurant?.category_name}</span>
            <span id='separator'>•</span>


            {/* <span>0.8 KM</span> */}

          </div>

        <div id='footer'>
            <span>49-59 min</span>
            <span id='separator'>•</span>
            <span>R$ {restaurant?.delivery_fee}</span>
        </div>

        {/* <div id='context'>
          [AREA DE CUPOM] 
        </div> */}

      </div>
        {restaurant?.manager_id == getCurrentUser()['id'] ? 

          <div id='actions'>
            <button className="btn btn-outline btn-info">Editar</button>
            <button  onClick={() => {document.getElementById(`my_modal_delete_restaurant_${restaurant?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
            <DeleteRestaurant HandleFetch={HandleFetch} restaurant_id={restaurant?.id}/>
          </div>
        :
          null
        }

    </>
  )
} 


export default Restaurant
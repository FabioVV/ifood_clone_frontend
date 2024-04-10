import React from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import DeleteRestaurant from './DeleteRestaurantModal'
import { NavLink } from 'react-router-dom'
import { useNavigate } from "react-router-dom";



function Restaurant({restaurant, HandleFetch}) {

  let navigate = useNavigate();

  return (
    <div id='merchant'>
      <div  onClick={()=>{navigate(`/delivery/restaurante/${restaurant?.id}/${restaurant?.name.replace(' ','-')+restaurant?.state.replace('','-')}`)}}>
        <div id='image-container' className='rounded-lg  overflow-hidden'>

          <img style={{objectFit:'contain', maxHeight:'135px'}} width={135} height={135} src={`http://localhost:8000${restaurant?.logo}`} alt={`Imagem do restaurante ${restaurant?.name}`} className='rounded-lg overflow-hidden'/>

    
        </div>

        <div id="content">
          <h3 id='title'>

            <div id='title-header'>
              <span id='title-name'>{restaurant?.name}</span>
            </div>
            
          </h3>

          <div id='title-info'>

              <span id='rating'>
                  <span>
                    <i style={{fontSize:'12px'}} className="fa-solid fa-star text-secondary"></i>
                  </span>
                  <span style={{fontSize:'12px'}} className='text-secondary'>
                    {restaurant?.restaurant_avg_rating}
                  </span> 
              </span> 
            
              <span id='separator'>•</span>
              <span>{restaurant?.category_name}</span>
              <span id='separator'>•</span>


              {/* <span>0.8 KM</span> */}

            </div>

          <div id='footer'>
              <span>49-59 min</span>
              <span id='separator'>•</span>
              <span>{restaurant?.delivery_fee > 0.00 ? 'R$ ' + restaurant?.delivery_fee : <span style={{color:'green'}}>Grátis</span>}</span>
          </div>

          {/* <div id='context'>
            [AREA DE CUPOM] 
          </div> */}

        </div>
          

      </div>
      {restaurant?.manager_id == getCurrentUser()['id'] ? 

            <div id='actions' style={{zIndex:'200'}}>
              <NavLink to={`/editar-restaurante/${restaurant?.id}`} className="btn btn-outline btn-info">Editar</NavLink>
              <button></button>
              <button  onClick={() => {document.getElementById(`my_modal_delete_restaurant_${restaurant?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
              <DeleteRestaurant HandleFetch={HandleFetch} restaurant_id={restaurant?.id}/>
            </div>
          :
            null
          }
    </div>
  )
} 


export default Restaurant
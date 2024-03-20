import React from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import { NavLink } from 'react-router-dom'

function Product({product, HandleFetch}) {

  return (
    <div id="merchant">
      <div id='image-container' className='rounded-lg  overflow-hidden'>
        <img width={135} height={135} src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name}`} className='rounded-lg overflow-hidden'/>
      </div>

      <div id="content">
        <h3 id='title'>

          <div id='title-header'>
            <span id='title-name'>{product?.name}</span>
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
            <span>{product?.restaurant_name}</span>
            <span id='separator'>•</span>


            {/* <span>0.8 KM</span> */}

          </div>

        <div id='footer'>
            <span>Quantidade: {product?.qtd}</span>
            <span id='separator'>•</span>
            <span>R$ {product?.price}</span>
        </div>

        {/* <div id='context'>
          [AREA DE CUPOM] 
        </div> */}

      </div>
        {!getCurrentUser()['is_staff'] ? 

          <div id='actions'>
            <NavLink to={`/editar-produto/${product?.id}`} className="btn btn-outline btn-info">Editar</NavLink>
            <button></button>
            <button  onClick={() => {document.getElementById(`my_modal_delete_product_${product?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
          </div>
        :
          null
        }

    </div>
  )
} 


export default Product
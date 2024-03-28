import React, {useState, useEffect} from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import { NavLink } from 'react-router-dom'

import useLocalStorageState from 'use-local-storage-state'

function Product({product, HandleFetch}) {

  
  const [products, setProducts] = useLocalStorageState('bytefood_cart', [])

  function handle(){

    Object.assign(product, {id_cart : Math.floor(Math.random() * 1000)})
    setProducts([...products, product])
  }

  return (
    <div id="merchant">

      <div id='image-container' className='rounded-lg  overflow-hidden'>
        <img width={135} height={135} src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name ? product?.name : '/media/_default/restaurant_default.jpeg'}`} className='rounded-lg overflow-hidden'/>
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
            {/* <span>Quantidade: {product?.qtd}</span> */}
            <span id='separator'>•</span>
            <span>R$ {product?.price}</span>
            <span id='separator'>•</span>

        </div>

        {/* <div id='context'>
          [AREA DE CUPOM] 
        </div> */}
        {getCurrentUser()['is_staff'] ? 

          <div id=''>
            <NavLink to={`/editar-produto/${product?.id}`} className="btn btn-outline btn-info">Editar</NavLink>
            <button onClick={() => {document.getElementById(`my_modal_delete_product_${product?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
            <button onClick={() => {handle()}} className="btn btn-outline btn-primary">Adicionar ao carrinho</button>
          </div>
        :
        <div id=''>
          <button onClick={() => {handle()}} className="btn btn-outline btn-primary">Adicionar ao carrinho</button>
        </div>
        }

      </div>
        

    </div>
  )
} 


export default Product
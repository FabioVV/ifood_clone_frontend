import React, {useState, useEffect} from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import { NavLink } from 'react-router-dom'

import useLocalStorageState from 'use-local-storage-state'

function Product({product, HandleFetch}) {

  
  const [products, setProducts] = useLocalStorageState('bytefood_cart', [])

  function HandleCart(){

    Object.assign(product, {id_cart : Math.floor(Math.random() * 1000)})
    setProducts([...products, product])
  }

  return (
    <div id="product" onClick={() => {HandleCart()}}>

      <div id='image-container' className='rounded-lg  overflow-hidden'>
        <img width={210} height={210} src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name ? product?.name : '/media/_default/restaurant_default.jpeg'}`} className='rounded-lg overflow-hidden'/>
      </div>

      <div id="content">
        <h3 id='title'>

          <div id='title-header'>
            <span id='title-name' style={{fontSize:'1.3em'}}>{product?.name}</span>
          </div>
          
        </h3>

        <div id='title-info'>

          <span>{product?.description}</span>

        </div>

        <div id='footer'>
            <span className='text-green-700'>R$ {product?.price.toString().replace('.', ',')}</span>

        </div>


        {getCurrentUser()['is_staff'] ? 

          <div id=''>
            <NavLink to={`/editar-produto/${product?.id}`} className="btn btn-outline btn-info">Editar</NavLink>
            <button onClick={() => {document.getElementById(`my_modal_delete_product_${product?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
            <button onClick={() => {handle()}} className="btn btn-outline btn-primary">Adicionar ao carrinho</button>
          </div>
        :
          null
        }

      </div>
        

    </div>
  )
} 


export default Product
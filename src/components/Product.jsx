import React, {useState, useEffect} from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import { NavLink } from 'react-router-dom'
import useLocalStorageState from 'use-local-storage-state'


function Product({product, HandleFetch}) {
  
  const [products, setProducts] = useLocalStorageState('bytefood_cart', [])
  const [TotalProductsCart, setTotalProductsCart] = useState(1)
  const [UpdatedPrice, setUpdatedPrice] = useState(0)


  function HandleCart(){

    setProducts([...products, product])

  }


  function HandlePrice(operator){

    let updatedTotalProductsCart;

    if (operator === '+') {
      updatedTotalProductsCart = TotalProductsCart + 1;
    } else if (operator === '-') {
      updatedTotalProductsCart = TotalProductsCart > 1 ? TotalProductsCart - 1 : TotalProductsCart;
    }
    
    setTotalProductsCart(updatedTotalProductsCart);
    
    const updatedPrice = parseFloat(updatedTotalProductsCart * product?.price);
    setUpdatedPrice(updatedPrice)


  }

  return (
    <div id="product" onClick={() => {document.getElementById('product_modal').showModal()}}>

      <dialog id="product_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">

          <section id='product-modal-section'>

            <div>
              <div id='image-container' className='rounded-lg  overflow-hidden'>
                <img width={500} height={500} src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name ? product?.name : '/media/_default/restaurant_default.jpeg'}`} className='rounded-lg overflow-hidden'/>
              </div>
            </div>

            <div id='product-modal-info'>
              <div><h1 id='dish-title' style={{fontSize:'1.3em', textAlign:'center'}}>{product?.name}</h1></div>
              <div><p id='dish-info'>{product?.description}</p></div>
              <div style={{alignSelf:'flex-start'}}><span className='text-green-700'>A partir de R$ {product?.price.toString().replace('.', ',')}</span></div>
            </div>


            <div>
            </div>

          </section>

          <div className="modal-action">
            <form method="dialog">

              <div style={{marginRight:'9px'}} className="join">
                <button type='button' className="btn join-item" onClick={() => { HandlePrice('-')}}>-</button>
                <button type='button' className="btn join-item">{TotalProductsCart}</button>
                <button type='button' className="btn join-item" onClick={() => { HandlePrice('+')}}>+</button>
              </div>
              <button type='button' style={{marginRight:'9px'}} className="btn" onClick={()=>{HandleCart()}}>Adicionar<span className='text-green-700'>R$ {UpdatedPrice  ? parseFloat(UpdatedPrice).toFixed(2) : parseFloat(product?.price).toFixed(2)}</span></button>

              <button className="btn">Fechar</button>
            </form>
          </div>
        </div>
      </dialog>

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
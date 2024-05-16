import React, {useState, useEffect} from 'react'
import { getCurrentUser } from '../utils/UserlocalStorage'
import { NavLink } from 'react-router-dom'
import useLocalStorageState from 'use-local-storage-state'


function Product({product, HandleFetch, show_modal = true}) {
  
  const [products, setProducts] = useLocalStorageState('bytefood_cart', [])
  const [TotalProductsCart, setTotalProductsCart] = useState(1)
  const [UpdatedPrice, setUpdatedPrice] = useState(0)
  const [AddedToCart, setAddedToCart] = useState(false)


  function HandleCart(){


    Object.assign(product, {id_cart : Math.floor(Math.random() * 10000)})
    Object.assign(product, {product_quantity_choosen : TotalProductsCart})
    Object.assign(product, {new_price : UpdatedPrice})

    setProducts([...products, product])
    setAddedToCart(true)
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

  function truncated_description(){

    const description_length = 220

    if(product.description.length > description_length){
      return product.description.substring(0, description_length) + "..."
    }

    return product.description
  }


  useEffect(()=>{

    if(AddedToCart){
      document.getElementById(`btn_close_product_modal_${product.id}`).click()
      setAddedToCart(false)

    }

  },[AddedToCart])

  return (
    <div id="product" onClick={() => {
        if(show_modal){
          document.getElementById(`product_modal_${product?.id}`).showModal()
        }
      }}>

      <dialog id={`product_modal_${product?.id}`} className="modal">
        <div className="modal-box w-11/12 max-w-screen-2xl">

          <section id='product-modal-section'>

            
            <div id='image-container-modal' className='rounded-lg  overflow-hidden'>
              <img src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name ? product?.name : '_default/restaurant_default.jpeg'}`} className='rounded-lg overflow-hidden'/>
            </div>
          

            <div id='product-modal-info'>
              <div><h1 id='dish-title' style={{fontSize:'1.3em', textAlign:'center'}}>{product?.name}</h1></div>
              <div style={{alignSelf:'flex-start'}}><span className='text-green-700'>A partir de R$ {product?.price.toString().replace('.', ',')}</span></div>

              <div><p id='dish-info'>{product?.description}</p></div>
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

              <button className="btn" id={`btn_close_product_modal_${product?.id}`}>Fechar</button>
            </form>
          </div>
        </div>
      </dialog>


      <div id='image-container' className='overflow-hidden'>
        <img  src={`http://localhost:8000${product?.image}`} alt={`Imagem do producte ${product?.name ? product?.name : '_default/restaurant_default.jpeg'}`} className='rounded-lg overflow-hidden'/>
      </div>

      <div id="content">
        <h3 id='title'>

          <div id='title-header'>
            <span id='title-name' style={{fontSize:'1.3em'}}>{product?.name}</span>
          </div>
          
        </h3>

        <div id='title-info'>

          <span>{truncated_description()}</span>

        </div>

        <div id='footer'>
            <span className='text-green-700'>A partir de R$ {parseFloat(product?.price).toFixed(2).toString().replace('.', ',')}</span>

        </div>


        {getCurrentUser()['is_staff'] ? 

          <div id=''>
            <NavLink to={`/editar-produto/${product?.id}`} className="btn btn-outline btn-info">Editar</NavLink>
            <button onClick={() => {document.getElementById(`my_modal_delete_product_${product?.id}`)?.showModal()}} className="btn btn-outline btn-error">Excluir</button>
            <button onClick={() => {document.getElementById(`product_modal_${product?.id}`).showModal()}} className="btn btn-outline btn-primary">Adicionar ao carrinho</button>
          </div>
        :
          null
        }

      </div>
        

    </div>
  )
} 


export default Product
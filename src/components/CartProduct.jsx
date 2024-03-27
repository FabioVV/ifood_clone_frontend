import React, {useState} from 'react'
import useLocalStorageState from "use-local-storage-state"

function CartProduct({product, handleFetch}) {

    const [products, setProducts] = useLocalStorageState('bytefood_cart', [])

    const removeItem = (id) => {
        setProducts(products.filter(item => item.id_cart !== id));
    };

  return (
    <div id='cart-items'>
        <header id='header-cart'>

            <span id="header-span">Seu pedido em </span>
            <h1>{product?.restaurant_name}</h1>
            <span></span>

        </header>

        

        <div id='cart-content'>
            <div id='cart-item'>
                <span>1x {product?.name}</span>
                <span>R$ {product?.price}</span>
            </div>
            {/* <div>
                <span>MODIFICA;'AO PRODUTO</span>
            </div> 
            تاكو الدهون الكبيرة*/}
            <div id='cart-actions'>
                {/* <button type='button' className='btn btn-outline btn-primary btn-xs'>Editar</button> */}
                <button onClick={() => {removeItem(product?.id_cart)}} type='button' className='btn btn-outline btn-error btn-xs'>Remover</button>
            </div>
        </div>

        <hr />


        
    </div>
  )
}

export default CartProduct
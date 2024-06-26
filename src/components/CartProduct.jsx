import {useState, useCallback} from 'react'
import useLocalStorageState from "use-local-storage-state"

function CartProduct({product, handleFetch}) {

    const [products, setProducts] = useLocalStorageState('bytefood_cart', [])
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);



    const removeItem = (id) => {

        if(product.product_quantity_choosen && product.product_quantity_choosen > 1){

            let index = products.findIndex(product_ => product_.id_cart === product.id_cart);
            let updatedProducts = [...products];

            product.product_quantity_choosen = product.product_quantity_choosen - 1
            updatedProducts[index] = product;

            if(product.product_quantity_choosen == 1){
                product.new_price = 0
                
            } else if(product.product_quantity_choosen > 1) {
                product.new_price = product.product_quantity_choosen * product.price


            }

            setProducts(updatedProducts)

            forceUpdate()
        } else {
            setProducts(products.filter(item => item.id_cart !== id));
        }


    };




  return (
    <div id='cart-items'>
        <header id='header-cart'>

            <h1>{product?.restaurant_name}</h1>
            <span></span>

        </header>

        

        <div id='cart-content'>
            <div id='cart-item'>
                <span>{product?.product_quantity_choosen}x {product?.name}</span>
                <span>R$ {product?.new_price > 0 ? parseFloat(product?.new_price).toFixed(2): parseFloat(product?.price).toFixed(2)}</span>
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
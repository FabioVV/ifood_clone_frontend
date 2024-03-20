import {useState, useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import DefaultPage from '../../../components/DefaultPage'
import Product from '../../../components/Product'
import { getCurrentUser, getCurrentUserToken } from '../../../utils/UserlocalStorage'

function ProductList({data, HandleFetch}){
    return (
      <>
        {data?.map((product) => (
            <Product
              key={product.id}
              product={product}
              HandleFetch={HandleFetch}
            />
        ))}
      </>
    )
}



function Products() {
    const [Products, SetProducts] = useState([])
    const [user, SetUser] = useState(getCurrentUser)
    const [isLoading, setIsLoading] = useState(false)


    const fetchProducts = async (url = 'http://127.0.0.1:8000/api/v1/products/available-products/') => {
        setIsLoading(true)

        const response = await fetch(url, {
          method:'GET',
          headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
        })
    
        if(response.ok){
            const data = await response.json()
            SetProducts(data)
        } 
        setIsLoading(false)
    }
    
    
    useEffect(()=>{fetchProducts()},[user])

  return (
    <DefaultPage>
        <div id='main-stores'> 
            <h1 id='title-stores' className='text-left'>
                <span></span>
                <span>Produtos</span>
                <span></span>
                
            </h1>

            <div id='stores'>

                <ProductList data={Products} HandleFetch={null} />

            </div>
        </div>

    </DefaultPage>
  )
} 


export default Products
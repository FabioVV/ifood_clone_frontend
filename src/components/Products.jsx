import React, {useEffect, useState} from 'react'
import Product from './Product';
import { getCurrentUserToken } from '../utils/UserlocalStorage';



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

function Products({name = ''}) {

    const [Products, SetProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchProductsSearch = async (url = `http://127.0.0.1:8000/api/v1/products/available-products/?name=${name}`) => {
        setIsLoading(true)
    
        try{
            const response = await fetch(url, {
                method:'GET',
                headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
            })
      
            const data = await response.json()
      
            SetProducts(data)          
      
        } catch(e){
            console.log(e.message)
    
        } finally{
            setIsLoading(false)
    
        }
        
      }

    useEffect(() => {

        fetchProductsSearch();
        

    }, []);

  return (
    <div id='products'>
        {isLoading ? 
            <span className="loading loading-spinner loading-lg"></span>
        :
            <ProductList data={Products} HandleFetch={null} />
        }
    </div>
  )
}

export default Products
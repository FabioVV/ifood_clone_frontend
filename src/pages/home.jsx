import React, {useEffect, useState} from 'react'
import DefaultPage from '../components/DefaultPage'
import hero_food from '../public/img/hero_food.jpg'
import { getCurrentUser, getCurrentUserToken } from '../utils/UserlocalStorage'
import Restaurant from '../components/Restaurant'
import Product from '../components/Product'

function RestaurantsList({data, HandleFetch}){
  return (
    <>
      {data?.map((restaurant) => (
          <Restaurant
            key={restaurant.id}
            restaurant={restaurant}
            HandleFetch={HandleFetch}
          />
      ))}
    </>
  )
}




function Home() {

  const [user, SetUser] = useState(getCurrentUser)
  const [Restaurants, SetRestaurants] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const fetchRestaurants = async (url = 'http://127.0.0.1:8000/api/v1/restaurants/available-restaurants/') => {
    setIsLoading(true)
    const response = await fetch(url, {
      method:'GET',
      headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
    })

    if(response.ok){
        const data = await response.json()
        SetRestaurants(data)
    } 
    setIsLoading(false)
  }


  useEffect(()=>{fetchRestaurants()},[user])


  return (
    <DefaultPage>

        {!user?.id  ?
          <div className="hero min-h-screen" style={{ backgroundImage:`url(${hero_food})` }}>

              <div className="hero-overlay bg-opacity-60"></div>
  
              <div className="hero-content text-center text-neutral-content">
                  <div className="max-w-md">
                    <h1 className="mb-5 text-6xl font-bold">Você tem fome do quê?</h1>
  
                    <p className="mb-5">Digite seu endereço e descubra como é gostoso fazer parte desta comunidade!</p>
                  
                    <label className="input input-bordered flex items-center gap-2 text-black">
                      <input type="text" className="grow text-black" placeholder="Qual seu endereço?" />
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                    </label>
  
                  </div>
              </div>
          </div>
        :
          <>
              <div id='filters'>
                <ul>
                  <li>Ordernar</li>
                  <li>Entrega grátis</li>
                  <li>Entrega parceira</li>
                  <li>Super restaurantes</li>
                  <li>Limpar</li>
                </ul>
              </div>
  
              <div id='main-stores'> 
                <h1 id='title-stores' className='text-left'>
                  <span></span>
                  <span>Lojas</span>
                  <span></span>
                  
                </h1>

                <div id='stores'>

                  <RestaurantsList data={Restaurants} HandleFetch={fetchRestaurants} />

                </div>
              </div>

              

          </>
        }


    </DefaultPage>
  )


}

export default Home
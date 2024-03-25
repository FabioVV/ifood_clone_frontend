import React, {useEffect, useState, useRef } from 'react'
import DefaultPage from '../components/DefaultPage'
import hero_food from '../public/img/hero_food.jpg'
import { getCurrentUser, getCurrentUserToken } from '../utils/UserlocalStorage'
import Restaurant from '../components/Restaurant'
import Category from '../components/Category'


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

function CategoriesList({data, HandleFetch}){
  return (
    <>
      {data?.map((category) => (
          <Category
            key={category.id}
            category={category}
            HandleFetch={HandleFetch}
          />
      ))}
    </>
  )
}






function Home() {

  const [user, SetUser] = useState(getCurrentUser)

  const [Restaurants, SetRestaurants] = useState([])
  const [Categories, SetCategories] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [leftPosition, setLeftPosition] = useState(0); 

  const [PageNumber, setPageNumber] = useState(1)
  const [TotalPages, setTotalPages] = useState(0)


  const [FreeDelivery, setFreeDelivery] = useState(false)
  const [PartnerDelivery, setPartnerDelivery] = useState(false)
  const [SuperRestaurant, setSuperRestaurant] = useState(false)


  function HandlePageNumber(){

    let next_page = PageNumber + 1

    if(next_page <= TotalPages){
      setPageNumber(next_page)
    } else {
      setPageNumber(PageNumber)
    }
     
  }

  function moveLeft() {
    setLeftPosition(prevPosition => prevPosition - 90); 
  }

  function moveRight() {
    setLeftPosition(prevPosition => prevPosition + 90); 
  }

  function cleanSearchFields(){
    setFreeDelivery(false)
    setPartnerDelivery(false)
    setSuperRestaurant(false)
  }

  
  const fetchRestaurants = async (url = `http://127.0.0.1:8000/api/v1/restaurants/available-restaurants/?page=${PageNumber}&super_restaurant=${SuperRestaurant}&partner_delivery=${PartnerDelivery}&free_delivery=${FreeDelivery}`) => {
    setIsLoading(true)


    const response = await fetch(url, {
      method:'GET',
      headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
    })

    const data = await response.json()


    // ARRUMAR ESTA LOGICA Q ESTA FERRADA

    if(data['total_pages']){
      setTotalPages(parseInt(data['total_pages']))
      // SetRestaurants(data?.results)

      if(Restaurants.length > 0){
        SetRestaurants([...Restaurants, ...data?.results])

      } else{
        SetRestaurants(data?.results)

      }
      
    } 


    setIsLoading(false)
  }


  const fetchCategories = async (url = 'http://127.0.0.1:8000/api/v1/categories/available-categories/') => {
    setIsLoading(true)
    const response = await fetch(url, {
      method:'GET',
      headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
    })


    if(response.ok){
        const data = await response.json()
        SetCategories(data)
    } 
    setIsLoading(false)
  }


  useEffect(()=>{fetchRestaurants();fetchCategories();},[user])


  useEffect(()=>{

    fetchRestaurants();

  },[PageNumber, SuperRestaurant,PartnerDelivery,FreeDelivery])


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

              <div id='main-categories'>
                <i onClick={moveLeft} id='moveLeft'  style={{display:'flex', alignItems:'center'}} className="fa-solid fa-chevron-left arrow hv"></i>

                  <div id='categories' style={{ left: `${leftPosition}px`}}>
                    <CategoriesList data={Categories} HandleFetch={fetchCategories} />
                  </div>

                <i onClick={moveRight} id='moveRight'  style={{display:'flex', alignItems:'center'}} className="fa-solid fa-chevron-right arrow hv"></i>
              </div>

            
              <div id='filters' className='sticky top-0 z-10'  style={{top:'6rem'}}>
                <ul>
                
                  <button onClick={()=>document.getElementById('sort-modal').showModal()} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md">Ordernar<i className="fa-solid fa-chevron-down"></i></button>
                  <input checked={FreeDelivery} onChange={()=>{setFreeDelivery(!FreeDelivery)}} type="checkbox" aria-label="Entrega grátis" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                  <input checked={PartnerDelivery} onChange={()=>{setPartnerDelivery(!PartnerDelivery)}} type="checkbox" aria-label="Entrega parceira" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                  <input checked={SuperRestaurant} onChange={()=>{setSuperRestaurant(!SuperRestaurant)}} type="checkbox" aria-label="Super restaurantes" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                  <button onClick={cleanSearchFields} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md">Limpar</button>

                </ul>
              </div>
  
              <div id='main-stores' > 
                <h1 id='title-stores' className='text-left'>
                  Lojas
                </h1>

                <div id='stores'>

                  <RestaurantsList data={Restaurants} HandleFetch={fetchRestaurants} />

                </div>
              </div>

              <div style={{margin:'0 auto', display:'flex', marginTop:'4rem', justifyContent:'center'}}>
                <button onClick={()=>{ setPageNumber(HandlePageNumber);}} style={{width:'75%'}} className="btn btn-block">
                  {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Mais'}
                </button>
              </div>



              <dialog id="sort-modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-center">Ordernar por</h3>
          
                    <div id='sort-container'>
                      <div>
                        <div>a</div>
                        <div>b</div>
                        <div>c</div>
                      </div>

                      <div>
                        <div>a</div>
                        <div>b</div>
                        <div>c</div>
                      </div>
                    </div>

                    <div className="modal-action">
                      <form method="dialog">
                          <button className="btn">Fechar</button>
                      </form>
                    </div>
                </div>
              </dialog>
          </>
        }


    </DefaultPage>
  )


}

export default Home
import React, {useEffect, useState } from 'react'
import { getCurrentUserToken } from '../utils/UserlocalStorage'
import Restaurant from '../components/Restaurant'


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



function Restaurants({category_list_id = ''}) {
  
  const [Restaurants, SetRestaurants] = useState([])
  const [RestaurantsSearched, SetRestaurantsSearched] = useState([])


  const [PageNumber, setPageNumber] = useState(1)
  const [SearchPageNumber, setSearchPageNumber] = useState(1)

  const [TotalPages, setTotalPages] = useState(0)
  const [TotalSearchPages, setTotalSearchPages] = useState(0)

  const [FreeDelivery, setFreeDelivery] = useState(false)
  const [PartnerDelivery, setPartnerDelivery] = useState(false)
  const [SuperRestaurant, setSuperRestaurant] = useState(false)
  const [OrderBy, setOrderBy] = useState('')

  const [isLoading, setIsLoading] = useState(false)



  function handlePaginationClick(){
    if(!SuperRestaurant && !PartnerDelivery && !FreeDelivery){

      let next_page = PageNumber + 1

      if(next_page <= TotalPages){
        setPageNumber(next_page)
      } else {
        setPageNumber(PageNumber)
      }      

    } else if(SuperRestaurant || PartnerDelivery || FreeDelivery) {

      let next_page = SearchPageNumber + 1

      if(next_page <= TotalSearchPages){
        setSearchPageNumber(next_page)
      } else {
        setSearchPageNumber(SearchPageNumber)
      }

    }
  }


  function cleanSearchFields(){
    setFreeDelivery(false)
    setPartnerDelivery(false)
    setSuperRestaurant(false)
  }

  
  const fetchRestaurants = async (url = `http://127.0.0.1:8000/api/v1/restaurants/available-restaurants/?page=${PageNumber}&order_by=${OrderBy}&category_id=${category_list_id}`) => {
    setIsLoading(true)


    const response = await fetch(url, {
      method:'GET',
      headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
    })

    const data = await response.json()


    if(data['total_pages']){
      setTotalPages(parseInt(data['total_pages']))

      if(Restaurants.length > 0){
        SetRestaurants([...Restaurants, ...data?.results])

      } else {
        SetRestaurants(data?.results)

      }

    } 

    setIsLoading(false)
  }



  const fetchRestaurantsSearch = async (url = `http://127.0.0.1:8000/api/v1/restaurants/available-restaurants-search/?page=${SearchPageNumber}&super_restaurant=${SuperRestaurant}&partner_delivery=${PartnerDelivery}&free_delivery=${FreeDelivery}&order_by=${OrderBy}&category_id=${category_list_id}`) => {
    setIsLoading(true)

    try{
      const response = await fetch(url, {
        method:'GET',
        headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
      })
  
      const data = await response.json()
  
      if(data['total_pages']){
        setTotalSearchPages(parseInt(data['total_pages']))
    
        if(RestaurantsSearched.length > 0){
  
          if(data?.results.length == 0){
            SetRestaurantsSearched([])
  
            return false
  
          }

          if(OrderBy){
            SetRestaurantsSearched([])
            SetRestaurants([])
          }
  
          const newData = data?.results.filter(newRestaurant => 
            !RestaurantsSearched.some(existingRestaurant => existingRestaurant.id === newRestaurant.id)
          );

          SetRestaurantsSearched([...RestaurantsSearched, ...newData])
  
          if (SuperRestaurant) {
            const newSearch = RestaurantsSearched.filter(existingRestaurant => existingRestaurant.super_restaurant);
            SetRestaurantsSearched([...newSearch, ...newData]);
          }
          
          if (PartnerDelivery) {
            const newSearch = RestaurantsSearched.filter(existingRestaurant => existingRestaurant.PartnerDelivery);
            SetRestaurantsSearched([...newSearch, ...newData]);
          }

          if (FreeDelivery) {
            const newSearch = RestaurantsSearched.filter(existingRestaurant => existingRestaurant.delivery_fee === 0);
            SetRestaurantsSearched([...newSearch, ...newData]);
          }
  
        } else {
          SetRestaurantsSearched(data?.results)
  
        }
    
      } 
  
    } catch(e){
      console.log(e.message)

    } finally{
      setIsLoading(false)

    }
    
  }



  useEffect(()=>{

    SetRestaurantsSearched([])  

  },[SuperRestaurant ,PartnerDelivery, FreeDelivery, OrderBy])

  useEffect(()=>{

    SetRestaurants([])

    if(SuperRestaurant || PartnerDelivery || FreeDelivery){

      fetchRestaurantsSearch()

    } else {
      SetRestaurantsSearched([])  

      fetchRestaurants()
      setSearchPageNumber(1)
      setPageNumber(1)
    }

  },[SearchPageNumber, SuperRestaurant ,PartnerDelivery, FreeDelivery, OrderBy])



  useEffect(()=>{

    fetchRestaurants();

  },[PageNumber])

  return (
    <>

        <div id='filters' className='sticky top-0 z-10'  style={{top:'6rem'}}>
            <ul>
            
                <select value={OrderBy} onChange={(e)=>{setOrderBy(e.target.value)}} className="select select-bordered w-full max-w-xs">
                    <option value='id'>Ordenação padrão</option>
                    <option value='price'>Ordenação por preço</option>
                    <option value='delivery_fee'>Ordenação por taxa de entrega</option>
                </select>
                <input checked={FreeDelivery} onChange={()=>{setFreeDelivery(!FreeDelivery)}} type="checkbox" aria-label="Entrega grátis" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <input checked={PartnerDelivery} onChange={()=>{setPartnerDelivery(!PartnerDelivery)}} type="checkbox" aria-label="Entrega parceira" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <input checked={SuperRestaurant} onChange={()=>{setSuperRestaurant(!SuperRestaurant)}} type="checkbox" aria-label="Super restaurantes" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <button onClick={cleanSearchFields} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md">Limpar</button>

            </ul>
        </div>

        <div id='main-stores' > 


            <div id='stores'>
                {Restaurants.length > 0 ?
                    <RestaurantsList data={Restaurants} HandleFetch={fetchRestaurants} />
                :
                    <RestaurantsList data={RestaurantsSearched} HandleFetch={fetchRestaurantsSearch} />
                }
            </div>
        </div>

        <div style={{margin:'0 auto', display:'flex', marginTop:'4rem', justifyContent:'center'}}>
            <button onClick={()=>{ handlePaginationClick() }} style={{width:'75%'}} className="btn btn-block">
                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Mais'}
            </button>
        </div>

    </>
  )

}

export default Restaurants
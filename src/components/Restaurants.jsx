import React, {useEffect, useState, useRef } from 'react'
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



function Restaurants({category_list_id = '', name = ''}) {
  
  const [RestaurantsSearched, SetRestaurantsSearched] = useState([])


  const [SearchPageNumber, setSearchPageNumber] = useState(1)

  const [TotalSearchPages, setTotalSearchPages] = useState(0)

  const [FreeDelivery, setFreeDelivery] = useState(false)
  const [PartnerDelivery, setPartnerDelivery] = useState(false)
  const [SuperRestaurant, setSuperRestaurant] = useState(false)
  const [OrderBy, setOrderBy] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [shouldFetch, setShouldFetch] = useState(false);


  //TO KEEP TRACK OF THE CURRENT FILTERS VALUES
  const prevFilterValues = useRef({ SuperRestaurant, PartnerDelivery, FreeDelivery });


  function handlePaginationClick(){

    let next_page = SearchPageNumber + 1

    if(next_page <= TotalSearchPages){
        setSearchPageNumber(next_page)
      } else {
        setSearchPageNumber(SearchPageNumber)
      }
  }


  function cleanSearchFields(){
    setFreeDelivery(false)
    setPartnerDelivery(false)
    setSuperRestaurant(false)
  }

  

  const fetchRestaurantsSearch = async (url = `http://127.0.0.1:8000/api/v1/restaurants/available-restaurants-search/?page=${SearchPageNumber}&super_restaurant=${SuperRestaurant}&partner_delivery=${PartnerDelivery}&free_delivery=${FreeDelivery}&order_by=${OrderBy}&category_id=${category_list_id}&name=${name}`) => {
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
            SetRestaurantsSearched(_ => {return []})
            return false
  
          }

          if(OrderBy){
            SetRestaurantsSearched(_ => {return []})
          }


          SetRestaurantsSearched(prevRestaurants => {
            let newSearch = [...prevRestaurants];


            if (SuperRestaurant) {
              newSearch = newSearch.filter(existingRestaurant => existingRestaurant.super_restaurant);
            }
            
            if (PartnerDelivery) {
              newSearch = newSearch.filter(existingRestaurant => existingRestaurant.PartnerDelivery);
            }
    
            if (FreeDelivery) {
              newSearch = newSearch.filter(existingRestaurant => existingRestaurant.delivery_fee === 0);
            }
    


            return [...newSearch, ...data?.results];
          });

          SetRestaurantsSearched(prevRestaurants => {
            const uniqueRestaurants = Array.from(new Set(prevRestaurants.map(restaurant => restaurant.id)))
              .map(id => {
                return prevRestaurants.find(restaurant => restaurant.id === id)
              });
            return uniqueRestaurants;
          });

  
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



    useEffect(() => {
        setShouldFetch(true);
        SetRestaurantsSearched([]);

        if (
            SuperRestaurant !== prevFilterValues.current.SuperRestaurant ||
            PartnerDelivery !== prevFilterValues.current.PartnerDelivery ||
            FreeDelivery !== prevFilterValues.current.FreeDelivery
        ) {
            // If they have, reset the page number and update prevFilterValues
            setSearchPageNumber(1);
            prevFilterValues.current = { SuperRestaurant, PartnerDelivery, FreeDelivery };
        }


    }, [SuperRestaurant ,PartnerDelivery, FreeDelivery, OrderBy]);

    useEffect(() => {
        setShouldFetch(true);

    }, [SearchPageNumber]);
  

    useEffect(() => {

        if (shouldFetch) {
            fetchRestaurantsSearch();
            setShouldFetch(false); 
        }

    }, [shouldFetch]);
    

  return (
    <>
        <div id='filters' className='sticky top-0 z-10'  style={{top:'6rem'}}>
            <ul>
            
                <select value={OrderBy} onChange={(e)=>{setOrderBy(e.target.value)}} className="select select-bordered w-full max-w-xs">
                    <option value='id'>Ordenação padrão</option>
                    <option value='price'>Ordenação por preço</option>
                    <option value='rating'>Ordenação por avaliação</option>
                    <option value='delivery_fee'>Ordenação por taxa de entrega</option>
                </select>
                <input checked={FreeDelivery} onChange={()=>{setFreeDelivery(!FreeDelivery)}} type="checkbox" aria-label="Entrega grátis" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <input checked={PartnerDelivery} onChange={()=>{setPartnerDelivery(!PartnerDelivery)}} type="checkbox" aria-label="Entrega parceira" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <input checked={SuperRestaurant} onChange={()=>{setSuperRestaurant(!SuperRestaurant)}} type="checkbox" aria-label="Super restaurantes" className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md" />
                <button onClick={cleanSearchFields} className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md">Limpar</button>

            </ul>
        </div>


        <div id='stores'>
            { isLoading || shouldFetch ?
                <span className="loading loading-spinner loading-lg"></span>
            :
                <RestaurantsList data={RestaurantsSearched} HandleFetch={fetchRestaurantsSearch} />
            }
        </div>


        <div style={{display:'flex', marginTop:'4.5rem', justifyContent:'center'}}>
            <button onClick={()=>{ handlePaginationClick() }} style={{width:'75%'}} className="btn btn-block">
                {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Mais'}
            </button>
        </div>

    </>
  )

}

export default Restaurants
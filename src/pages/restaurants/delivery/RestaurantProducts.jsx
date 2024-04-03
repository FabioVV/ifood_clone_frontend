import React, {useState, useEffect} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { useParams } from "react-router-dom";
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';
import { getCurrentUserToken } from '../../../utils/UserlocalStorage';
import Product from '../../../components/Product';


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


function RestaurantProducts() {

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false)

    const [Search, SetSearch] = useState('')

    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })

    const [Restaurant, setRestaurant] = useState({
        id:'',
        name:'',
        description:'',
        street:'',
        neighborhood:'',
        complement:'',
        number:'',
        city:'',
        state:'',
        zip_code:'',
        logo:'',
        banner:'',
        cnpj:'',
        delivery_fee:'',
        restaurant_avg_rating:'',
        partner_delivery:'',
        super_restaurant:'',
    })

    const [Products, SetProducts] = useState([])


    useEffect(()=>{
        async function getRestaurant() {
            setIsLoading(true)

            try{
                const res = await fetch(`http://127.0.0.1:8000/api/v1/restaurants/get/${id}/`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json", 
                        Authorization:` Token ${getCurrentUserToken()}`,
                    },
                })
        
                if (!res.ok) {
                    show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
                }

                
                const restaurant = await res.json()
        
    
                if(restaurant['zip_code']){
                    setRestaurant(
                        {
                            id:id,
                            name:restaurant.name,
                            description:restaurant.description,
                            street:restaurant.street,
                            neighborhood:restaurant.neighborhood,
                            complement:restaurant.complement,
                            number:restaurant.number,
                            city:restaurant.city,
                            state:restaurant.state,
                            zip_code:restaurant.zip_code,
                            cnpj:restaurant.cnpj,
                            delivery_fee:restaurant.delivery_fee,
                            partner_delivery:restaurant.partner_delivery,
                            super_restaurant:restaurant.super_restaurant,
                            restaurant_avg_rating:restaurant.restaurant_avg_rating,
                            banner:restaurant.banner,
                            logo:restaurant.logo,

                        }
                    )
                    
                }
    
    
            } catch(error){
                console.log(error)
    
            } finally{
                setIsLoading(false)

            }
    
        }

        async function getProducts(url = `http://127.0.0.1:8000/api/v1/products/available-products-restaurant/${id}/`) {
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

        if(id){
            getRestaurant()
            getProducts()
        }
    }, [id])


    useEffect(()=>{
        (async (url = `http://127.0.0.1:8000/api/v1/products/available-products-restaurant/${id}/?q=${Search}`)=>{
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
        })()
    }, [Search])
    

    

    return (
        <DefaultPage>
            {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

            <div id='restaurant-container'>
                <div id='header'>
                    <header id='merchant-banner'>
                        <img  src={`http://localhost:8000${Restaurant?.banner}`} alt={`Imagem do restaurante ${Restaurant?.name}`} className='rounded-lg overflow-hidden'/>
                    </header>

                    <header id='merchant-info'>
                        <div >
                            <div id='restaurant-logo-container'>
                                <img id='logo-restaurant-round' width={100} height={100}  src={`http://localhost:8000${Restaurant?.logo}`} alt={`Imagem do restaurante ${Restaurant?.name}`} />
                            </div>
                            <h2 id='restaurant-title-delivery'>{Restaurant.name}</h2>
                            <span>
                                {Restaurant.super_restaurant ? <i className="fa-solid fa-medal"></i>:''}
                            </span>
                            <span id='rating'>
                                <span>
                                    <i style={{fontSize:'12px'}} className="fa-solid fa-star text-secondary"></i>
                                </span>
                                <span style={{fontSize:'12px'}} className='text-secondary'>
                                    {Restaurant?.restaurant_avg_rating}
                                </span> 
                            </span> 
                        </div>
                        <div>
                            <div className="drawer drawer-end">
                                <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
                                <div className="drawer-content" style={{justifySelf:'self-end'}}>

                                    <label htmlFor="my-drawer-5" className="drawer-button btn btn-sm btn-outline btn-info">Ver mais</label>
                                </div> 
                                <div style={{zIndex:'10001'}} className="drawer-side">
                                    <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
                                        <ul  className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                                            {/* Sidebar content here */}

                                            <div role="tablist" className="tabs tabs-lifted">
                                                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Sobre" readOnly/>
                                                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Sobre</div>

                                                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Horário"  readOnly/>
                                                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Horário</div>

                                                <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="Pagamento" readOnly/>
                                                <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">Pagamento</div>
                                            </div>

                                        </ul>
                                </div>
                            </div>



                            <span id='smallest-amount-delivery'>Pedido mínimo R$ 30,00</span>
                        </div>
                    </header>
                </div>

                <div id='search-info'>
                    <div style={{width:'70%'}}>
                        <label className="input input-bordered flex items-center gap-2">
                            <input type="search" className="grow" placeholder="Procure no cardápio" onChange={(e)=>{SetSearch(e.target.value)}}/>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label>
                    </div>
                    <div id='itens-search-info-restaurant'>
                        <div id='itens-time' className='btn btn-outline'>
                            <i className="fa-solid fa-motorcycle"></i>
                            {' '}
                            Entrega
                        </div>
                        <div id='itens-info' className='btn btn-outline'>
                            <div><span>Hoje</span></div>
                            <div id='itens-info-time'>
                                <span>50-60 min</span>
                                <span id='separator'>•</span>
                                <span>R$ 10,00</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id='menu'>

                    <div id='products'>
                        {isLoading ? 
                            <span className="loading loading-spinner loading-lg"></span>
                        :
                            <ProductList data={Products} HandleFetch={null} />
                        }
                    </div>

                </div>
            </div>
        </DefaultPage>
    )
}

export default RestaurantProducts
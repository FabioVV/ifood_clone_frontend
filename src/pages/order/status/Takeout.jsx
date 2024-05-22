import { useEffect, useState } from "react"
import Product from "../../../components/Product"
import ProgressBar from "../../../components/ProgressBar"
import GoogleMapComponentTakeOut from "../../../components/GoogleMapComponentTakeOut"
import { getCurrentUserToken, removeOrderFromUser } from "../../../utils/UserlocalStorage"
import { useNavigate } from "react-router-dom";

import Alert from "../../../components/Alert"
import { show_flash_message } from "../../../utils/FlashMessages"

function Takeout({products, user_id, order_id}) {
    let navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false)
    const [readyToTakeout, setReadyToTakeout] = useState(false)

    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })

    async function markReadyToTakeout(){
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/payments/mark-order-ready-tk/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },

                body:JSON.stringify({
                    order_id: order_id,
                    user_id: user_id,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const result = await res.json()

            if(result['success']){
                setReadyToTakeout(true)
            }


        } catch(error){
            console.log(error)

        } finally {
            setIsLoading(false)

        }
    }

    async function markOrderDone(){

        if(!readyToTakeout) return false;

        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/payments/mark-order-done-tk/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },

                body:JSON.stringify({
                    order_id: order_id,
                    user_id: user_id,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const result = await res.json()

            if(result['success']){
                removeOrderFromUser()
                navigate('/')
            }


        } catch(error){
            console.log(error)

        } finally {
            setIsLoading(false)

        }

    }
    
    async function markOrderCancelled(){
        setIsLoading(true)

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/payments/mark-order-cancelled-tk/",{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json", 
                    Authorization:` Token ${getCurrentUserToken()}`,
                },

                body:JSON.stringify({
                    order_id: order_id,
                    user_id: user_id,
                })
            })

            if (!res.ok) {
                console.log(res.status)
            }
            
            const result = await res.json()

            if(result['success']){
                removeOrderFromUser()
                navigate('/')
            }


        } catch(error){
            console.log(error)

        } finally {
            setIsLoading(false)

        }

    }

    return (
        <section className="takeout">
            {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

            <div className="sticky top-0 z-10">
                <h1 className="takeout-title">
                    {!readyToTakeout ? " Seu pedido está sendo preparado -": "Seu pedido está pronto para ser retirado -"}
                    {products[0]?.restaurant_name}
                    </h1>
                <ProgressBar value={readyToTakeout ? 100: 0} valueBuffer={100}/>
            </div>

            <div style={{marginBottom:'1rem', marginTop:'1rem'}} id="products-takeout">
                
                {products?.map((product) => (
                   <Product
                    key={product?.id}
                    product={product}
                    HandleFetch={null}
                    show_modal={false}
                   />
                ))}
            </div>

            <div className="map-restaurant-location">
                <GoogleMapComponentTakeOut products={products}/>
            </div>

            <div className="tk-buttons">
                <button onClick={()=>markReadyToTakeout()} disabled={isLoading || readyToTakeout} type='submit' className="btn btn-info text-white">
                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: <span>Marcar pedido pronto para retirada <i className="fa-solid fa-check"></i></span>}
                </button>
                <button onClick={()=>markOrderDone()} disabled={isLoading || !readyToTakeout} type='submit' className="btn btn-success">
                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: <span>Marcar pedido concluído <i className="fa-solid fa-check"></i></span>}
                </button>
                <button onClick={()=>{document.getElementById('my_modal_cancel_order').showModal()}} disabled={isLoading} type='submit' className="btn btn-error text-white">
                    {isLoading ? <span className="loading loading-spinner loading-lg"></span>: <span>Cancelar pedido <i className="fa-solid fa-x"></i></span>}
                </button>
            </div>



            <dialog id={`my_modal_cancel_order`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>Aviso
                        
                    </h3>
                    <p className="py-4">Voçê tem certeza que deseja cancelar o pedido?</p>
                    <div className="modal-action">

                        <button onClick={()=>{markOrderCancelled()}} id={`my_modal_cancel_order`} className="btn btn-error text-white">Cancelar</button>

                        <form method="dialog">
                            <button id={`my_modal_cancel_order`} className="btn">Fechar</button>
                        </form>
                    </div>
                </div>
            </dialog>

        </section>



    )
}

export default Takeout
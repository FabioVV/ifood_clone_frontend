import { useEffect, useState } from "react"
import Product from "../../../components/Product"
import ProgressBar from "../../../components/ProgressBar"
import GoogleMapComponentTakeOut from "../../../components/GoogleMapComponentTakeOut"


function Takeout({products}) {

    return (
        <section className="takeout">
            <h1 className="takeout-title">Seu pedido está sendo preparado - {products[0]?.restaurant_name}</h1>
            <ProgressBar value={0} valueBuffer={100}/>

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
                <button className="btn btn-info text-white">Marcar pedido pronto para retirada <i className="fa-solid fa-check"></i></button>
                <button className="btn btn-success" >Marcar pedido entregue <i className="fa-solid fa-check"></i></button>
                <button onClick={()=>{document.getElementById('my_modal_cancel_order').showModal()}} className="btn btn-error text-white">Cancelar pedido <i className="fa-solid fa-x"></i></button>
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

                        <button id={`my_modal_cancel_order`} className="btn btn-error text-white">Cancelar</button>

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
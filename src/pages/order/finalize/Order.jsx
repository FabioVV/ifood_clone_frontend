import {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Addresses from '../../../components/Addresses'
import useLocalStorageState from 'use-local-storage-state'
import Address from '../../addresses/_list/Address'
import CheckoutForm from '../../payment/CheckoutForm'
import { useNavigate } from "react-router-dom";

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";

import { getCurrentUser } from '../../../utils/UserlocalStorage'
import { totalPriceCart } from '../../../utils/CartLocalStorage'

function Order() {
  const user = getCurrentUser()

  const navigate = useNavigate()

  const [SelectedAddress, SetSelectedAddress] = useState('')
  const [DeliveryType, SetDeliveryType] = useState('default')
  const [DeliveryTypePrice, SetDeliveryTypePrice] = useState(8.99)
  const [Type, SetType] = useState('EE') // EE: Entrega TK: Retirar na loja


  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const [products] = useLocalStorageState('bytefood_cart', [])
  const [cpf, setCpf] = useState(user?.cpf)
  const [cpfNota, setcpfNota] = useState(false)


  useEffect(()=>{console.log(Type)},[Type])
  return (
    <DefaultPage>
        <section id='order-section'>
            <div id='order-finalize'>
              <h1 id='finalize-title'>Finalize seu pedido</h1>

              <div role="tablist" className="tabs tabs-bordered">
                <input type="radio" onClick={()=>{SetType('EE')}} name="type" role="tab" className="tab" aria-label="Entrega" defaultChecked/>
                <div role="tabpanel" className="tab-content p-10">

                  <div id='user-addresses-div'>
                    <span style={{display:"none"}}>
                      <Addresses SetSelectedAddress={SetSelectedAddress}/>
                    </span>
                    {SelectedAddress?.id ? 
                      
                      <Address
                        key={SelectedAddress?.id}
                        address={SelectedAddress}
                        HandleFetch={null}
                        excludeDel={true}
                      />

                    :
                      <span className='mb-5 underline'>Sem endereço selecionado</span>
                    }

                  </div>  

                  <h4 id='delivery-order-title'>Hoje, {DeliveryType == 'fast' ? "30-50 min":"20-30 min"}</h4>

                  <div id='deliveries-type'>
                    <div style={{borderColor:DeliveryType == 'fast' ? "purple":""}} onClick={()=>{SetDeliveryType("fast"); SetDeliveryTypePrice(8.99);}}>
                      <span className='mb-3'>Padrão</span>
                      <span>Hoje, 30-50 min</span>
                      <span>R$ 8,99</span>
                    </div>

                    <div style={{borderColor:DeliveryType == 'default' ? "purple":""}} onClick={()=>{SetDeliveryType("default"); SetDeliveryTypePrice(14.99);}}>
                      <span className='mb-3'>Rápida</span>
                      <span>Hoje, 20-30</span>
                      <span>R$ 14,99</span>
                    </div>
                  </div>


                  <div style={{marginTop:'1.3rem'}}>
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">CPF na nota</span> 
                        <input type="checkbox" checked={cpfNota} onChange={()=>{setcpfNota(!cpfNota)}} className="checkbox" />
                      </label>
                    </div>
                    <input disabled={cpfNota ? false: true} id='cpf' type="text" className="input input-bordered input-md w-full max-w" value={cpf} onChange={(event) => {setCpf(event.target.value)} }/>
                  </div>

                  <section className='pay-sec'>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm type={Type} user_cpf_on_nfe={cpfNota ? cpf: ""} delivery_fee_speed_type={DeliveryType == 'fast' ? 8.99:14.99} address_selected={SelectedAddress}/>
                    </Elements>
                  </section>


                </div>

                <input type="radio" name="type" role="tab" className="tab" aria-label="Retirada" onClick={()=>{SetType('TK')}} />
                <div role="tabpanel" className="tab-content p-10">
                  <div style={{marginTop:'1.3rem'}}>
                      <div className="form-control">
                        <label className="label cursor-pointer">
                          <span className="label-text">CPF na nota</span> 
                          <input type="checkbox" checked={cpfNota} onChange={()=>{setcpfNota(!cpfNota)}} className="checkbox" />
                        </label>
                      </div>
                      <input disabled={cpfNota ? false: true} id='cpf' type="text" className="input input-bordered input-md w-full max-w" value={cpf} onChange={(event) => {setCpf(event.target.value)} }/>
                    </div>

                    <section className='pay-sec'>
                      <Elements stripe={stripePromise}>
                        <CheckoutForm type={Type} user_cpf_on_nfe={cpfNota ? cpf: ""} delivery_fee_speed_type={DeliveryType == 'fast' ? 8.99:14.99} address_selected={SelectedAddress}/>
                      </Elements>
                    </section>
                </div>

              </div>
                
            </div>

            <div id='order-info'>

              <span id='order-info-title'>Seu pedido em</span>
              <div className='order-info-title'>
                <h1 id='order-info-restaurant'>{products[0]?.restaurant_name}</h1>
                <span onClick={()=>{navigate(`/delivery/restaurante/${products[0]?.restaurant_id}/${products[0]?.restaurant_name?.replace(' ','-')+products[0]?.restaurant_state.replace('','-')}`)}} style={{cursor:'pointer'}} className='text-primary'>Ver cardápio</span>
              </div>

              <hr />

              {products?.map((product) => (
                <div className='orders' key={product?.id_cart}>
                  <span className='product-name-order'>{product?.product_quantity_choosen}x {product?.name}</span>
                  <span className='product-price-order'>R$ {product?.price.toString().replaceAll(".", ',')}</span>
                </div>
              ))}

              <hr />

              <div id='footer-cart'>

              <div>
                  <span>Subtotal</span>
                  <span>R$ {totalPriceCart(products)}</span>
              </div>

              <div>
                  <span>Taxa de serviço</span>
                  <span>R$ 0,99</span>
              </div>

              <div>
                  <span>Taxa de entrega</span>
                  <span>R$ 10</span>
              </div>

              <div>
                  <span>Modo de entrega - {DeliveryType == 'fast' ? "Padrão":"Rápido"}</span>
                  <span>R$ {parseFloat(DeliveryTypePrice).toFixed(2).toString().replaceAll(".", ",")}</span>
              </div>

              <div id='cart-total-span'>
                  <span>Total</span>
                  <span>R$ {parseFloat(totalPriceCart(products)+DeliveryTypePrice+10+0.99).toFixed(2)}</span>
                  
              </div>

              </div>


            </div>
        </section>

    </DefaultPage>
  )
}

export default Order
import React, {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Addresses from '../../../components/Addresses'

function Order() {

  const [SelectedAddress, SetSelectedAddress] = useState('')

  const [DeliveryType, SetDeliveryType] = useState('default')



  return (
    <DefaultPage>

        <section id='order-section'>
            <div id='order-finalize'>
              <h1 id='finalize-title'>Finalize seu pedido</h1>

              <div role="tablist" className="tabs tabs-bordered">
                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Entrega" checked/>
                <div role="tabpanel" className="tab-content p-10">

                  <div id='user-addresses-div'>
                    <Addresses SetSelectedAddress={SetSelectedAddress}/>
                  </div>  

                  <h4 id='delivery-order-title'>Hoje, {DeliveryType == 'fast' ? "30-50 min":"20-30 min"}</h4>

                  <div id='deliveries-type'>
                    <div style={{borderColor:DeliveryType == 'fast' ? "purple":""}} onClick={()=>SetDeliveryType("fast")}>
                      <span className='mb-3'>Padrão</span>
                      <span>Hoje, 30-50 min</span>
                      <span>R$ 8,99</span>
                    </div>

                    <div style={{borderColor:DeliveryType == 'default' ? "purple":""}} onClick={()=>SetDeliveryType("default")}>
                      <span className='mb-3'>Rápida</span>
                      <span>Hoje, 20-30</span>
                      <span>R$ 14,99</span>
                    </div>
                  </div>



                </div>

                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Retirada"  disabled />
                <div role="tabpanel" className="tab-content p-10">
                  Retirada
                </div>

              </div>
                
            </div>

            <div id='order-info'>

            </div>
        </section>

    </DefaultPage>
  )
}

export default Order
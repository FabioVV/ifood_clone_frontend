import React, {useState} from 'react'
import DefaultPage from '../../components/DefaultPage'

function IndexPayment() {

    const [newCard, setNewCard] = useState(false)
    
  return (
    <DefaultPage>
        {newCard ? 
        "aaa"
        :
            <section className='payment-index-section'>
                <h1 className='payment-title'>Formas de pagamento</h1>
                <h2 className='payment-subtitle'>Adicione um cartão bytefood</h2>
                <p className='payment-text'>É prático, seguro e você não perde nenhum minuto a mais quando seu pedido chegar.</p>
                <button onClick={()=>{setNewCard(!newCard)}} type="button" className="btn text-black-600">Adicionar novo cartão</button>
            </section>
        }


    </DefaultPage>
  )
}

export default IndexPayment
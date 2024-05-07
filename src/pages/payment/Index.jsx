import React, {useState} from 'react'
import DefaultPage from '../../components/DefaultPage'
import CheckoutForm from './CheckoutForm'

function IndexPayment() {

    // Todo
  return (
    <DefaultPage>
        <section className='pay-sec'>
            <CheckoutForm/>
        </section>
    </DefaultPage>
  )
}

export default IndexPayment
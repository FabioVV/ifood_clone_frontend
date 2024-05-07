import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { getCurrentUser } from "../../utils/UserlocalStorage";

const CheckoutForm = () => {
    const user = getCurrentUser()

    const [error, setError] = useState(null)
    const [email, setEmail] = useState(user?.email)
    const stripe = useStripe()
    const elements = useElements()

    // Handle real-time validation errors from the CardElement.
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const card = elements.getElement(CardElement);

        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type: 'card',
            card: card
       });

    }

    return (
        <form onSubmit={handleSubmit} className="stripe-form">
            <div className="email-checkout">

                <label className="input input-bordered flex items-center gap-2">
                    <span className="">Email</span>
                <input type="text" className="grow" id="email" name="name" placeholder="jenny.rosen@example.com" required
                value={email} onChange={(event) => { setEmail(event.target.value) }} />
                </label>

            </div>

            <div className="card-checkout">

                <label className="card-title" htmlFor="card-element">Cartão de crédito ou débito</label>
                    <CardElement id="card-element" onChange={handleChange} />
                <div className="card-errors" role="alert">{error}</div>

            </div>

            <div className="card-button">
                <button id="finalize_pay" style={{color:"white"}} type="submit" className="btn btn-primary">
                    Realizar pagamento
                </button>
            </div>


        </form>
    )
}

export default CheckoutForm;
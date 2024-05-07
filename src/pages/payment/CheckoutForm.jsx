import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserToken, updateCurrentUserOrder } from "../../utils/UserlocalStorage";
import useLocalStorageState from "use-local-storage-state";
import { totalPriceCart } from "../../utils/CartLocalStorage";
import { useNavigate } from "react-router-dom";


const CheckoutForm = ({user_cpf_on_nfe, delivery_fee_speed_type}) => {
    const user = getCurrentUser()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [email, setEmail] = useState(user?.email)
    const [totalAmount, setTotalAmount] = useState(0)
    const [products, setProducts] = useLocalStorageState('bytefood_cart', [])

    const stripe = useStripe()
    const elements = useElements()


    useEffect(()=>{
        setTotalAmount(parseFloat(totalPriceCart(products))+delivery_fee_speed_type+10+0.99)
    }, [])  


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
        setIsLoading(true)


        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type: 'card',
            card: card
       });

        try{

            const response = await fetch('http://127.0.0.1:8000/api/v1/payments/save-stripe-info/', {
                method:'POST',
                headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},

                body:JSON.stringify({
                    "payment_method_id": paymentMethod.id,
                    "amount":totalAmount,
                    "email":email,
                    "cpf":user_cpf_on_nfe,
                    "user_id":user?.id,
                })
            })


            if(response.status == 200){
                const data = await response.json()
                updateCurrentUserOrder(data['data']['order'])
                setProducts([])
                navigate("/acompanhar-pedido")

            }


        } catch(e){
            console.log(e.message)

        } finally{
            setIsLoading(false)

        }

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
                <button disabled={isLoading} id="finalize_pay" style={{color:"white"}} type="submit" className="btn btn-primary">
                    Realizar pagamento
                </button>
            </div>

        </form>
    )
}

export default CheckoutForm;
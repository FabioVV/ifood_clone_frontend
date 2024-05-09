import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { getCurrentUser, getCurrentUserToken, updateCurrentUserOrder } from "../../utils/UserlocalStorage";
import useLocalStorageState from "use-local-storage-state";
import { totalPriceCart } from "../../utils/CartLocalStorage";
import { useNavigate } from "react-router-dom";


const CheckoutForm = ({user_cpf_on_nfe, delivery_fee_speed_type, address_selected}) => {
    const user = getCurrentUser()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [email, setEmail] = useState(user?.email)
    const [totalAmount, setTotalAmount] = useState(0)
    const [products, setProducts] = useLocalStorageState('bytefood_cart', [])
    const [productsIds, setProductsIds] = useState([])

    const stripe = useStripe()
    const elements = useElements()


    useEffect(()=>{
        setTotalAmount(parseFloat(totalPriceCart(products))+delivery_fee_speed_type+10+0.99)
        setProductsIds(products.map(product => product.id));

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


        if(!address_selected?.id){
            document.getElementById('my_modal_address').showModal()
            return false
        }


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
                    "payment_method_id": paymentMethod?.id,
                    "amount":totalAmount,
                    "email":email,
                    "cpf":user_cpf_on_nfe ? user_cpf_on_nfe:"",
                    "user_id":user?.id,
                    "restaurant_id":products[0]?.id,
                    "products_ids":productsIds,
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
        <>
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
                        
                        {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Realizar pagamento'}

                    </button>
                </div>

            </form>



            <dialog id={`my_modal_address`} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>Aviso
                        
                    </h3>
                    <p className="py-4">Você precisa ter um endereço selecionado para finalizar a compra.</p>
                    <div className="modal-action">

                        <form method="dialog">
                            <button id={`my_modal_address`} className="btn">Fechar</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default CheckoutForm;
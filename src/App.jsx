import {BrowserRouter as Router} from 'react-router-dom'
import './index.css'
import _Routes from './routes'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from "@stripe/stripe-js/pure";


const stripePromise = loadStripe(`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`);


function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <Router>
            <_Routes/>
        </Router>
      </Elements>
    </>
  )
}

export default App

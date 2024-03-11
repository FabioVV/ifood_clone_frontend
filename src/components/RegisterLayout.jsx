import React from 'react'
import hero_food from "../public/img/hero_food.jpg";




function RegisterLayout(props) {
  return (

    <div style={{backgroundImage:`url(${hero_food})`}} className="hero min-h-screen bg-base-200">
        <div className="hero-overlay bg-opacity-60"></div>
        <div  className="hero-content flex-col lg:flex-row text-neutral-content">
            <div  className="text-center lg:text-left">
                <h1 className="mb-5 text-6xl font-bold">Registre-se agora!</h1>
                <p className="py-6">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
            </div>
            <div className="card shrink-0 w-full max-w-lg h-max shadow-2xl bg-base-100">
                {props.children}
            </div>
        </div>
    </div>

  )
}

export default RegisterLayout
import React from 'react'
import DefaultPage from '../components/DefaultPage'
import hero_food from '../public/img/hero_food.jpg'

function Home() {

  return (
    <DefaultPage>
        <div className="hero min-h-screen" style={{ backgroundImage:`url(${hero_food})` }}>

            <div className="hero-overlay bg-opacity-60"></div>

            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                <h1 className="mb-5 text-6xl font-bold">Você tem fome do quê?</h1>

                <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                
                <button className="btn btn-light">???</button>
                </div>
            </div>
        </div>
    </DefaultPage>
  )
}

export default Home
import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Restaurants from '../../../components/Restaurants'
import Products from '../../../components/Products'
import { useParams } from 'react-router-dom'


function QueryNav() {

    const {q} = useParams()

  return (
    <DefaultPage>
        <section id='query-nav-page'>
            <h1 id='query-nav-title'>Buscando por <span className='text-primary'>{q}</span></h1>
            <div role="tablist" className="tabs tabs-bordered">
            
                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Lojas" defaultChecked={true}/>
                <div role="tabpanel" className="tab-content p-10">
                  <Restaurants category_list_id={''} name={q}/>
                </div>

                <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Itens" />
                <div role="tabpanel" className="tab-content p-10">
                  <Products name={q}/>
                </div>

            </div>
        </section>
    </DefaultPage>
  )
}

export default QueryNav
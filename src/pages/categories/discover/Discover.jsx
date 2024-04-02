import React, {useState, useEffect} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Restaurants from '../../../components/Restaurants'
import { useParams } from 'react-router-dom'

function Discover() {

  const {slug} = useParams()
  const [Slug] = useState(slug.replaceAll('-', ' '))
  const {id} = useParams()


  return (
    <DefaultPage>

      <section id='main-section'>

        <h1 id='discover-title'>{Slug}</h1>

        <div>
          <Restaurants category_list_id={id}/>
        </div>

      </section>

    </DefaultPage>
  )
}

export default Discover
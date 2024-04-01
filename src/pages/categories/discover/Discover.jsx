import React, {useState, useEffect} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Restaurants from '../../../components/Restaurants'
import { useParams } from 'react-router-dom'

function Discover() {

  const {slug} = useParams()
  const [Slug] = useState(slug.replaceAll('-', ' '))
  const {id} = useParams()


  const [FreeDelivery, setFreeDelivery] = useState(false)
  const [PartnerDelivery, setPartnerDelivery] = useState(false)
  const [SuperRestaurant, setSuperRestaurant] = useState(false)
  const [OrderBy, setOrderBy] = useState('')



  function cleanSearchFields(){
    setFreeDelivery(false)
    setPartnerDelivery(false)
    setSuperRestaurant(false)
  }

  return (
    <DefaultPage>

      <section id='discover-section'>

        <h1 id='discover-title'>{Slug}</h1>

        <div>
          <Restaurants category_list_id={id}/>
        </div>

      </section>

    </DefaultPage>
  )
}

export default Discover
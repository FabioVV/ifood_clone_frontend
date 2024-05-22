import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from '../../../utils/UserlocalStorage'
import DefaultPage from '../../../components/DefaultPage'
import Delivery from './Delivery'
import Takeout from './Takeout'

function Status() {
  let navigate = useNavigate();

  const user = getCurrentUser()
  const TypeBought = user?.order?.type 
  const products = user?.order?.products

  useEffect(()=>{
    if(!user?.order){
      navigate('/')
    }
  },[])

  return (
    <DefaultPage>
      {(() => {
        switch (TypeBought) {
          case 'TK':
            return <Takeout products={products} user_id={user?.id} order_id={user?.order?.id}/>;

          case 'EE':
            return <Delivery products={products}/>;

        }
      })()}
    </DefaultPage>
  )
}

export default Status
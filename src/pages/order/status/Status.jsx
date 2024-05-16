import {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage'
import Delivery from './Delivery'
import Takeout from './Takeout'
import { getCurrentUser } from '../../../utils/UserlocalStorage'


function Status() {

  const user = getCurrentUser()
  const TypeBought = user?.order.type


  return (
    <DefaultPage>
      {(() => {
        switch (TypeBought) {
          case 'TK':
            return <Takeout/>;

          case 'EE':
            return <Delivery/>;

        }
      })()}
    </DefaultPage>
  )
}

export default Status
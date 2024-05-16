import DefaultPage from '../../../components/DefaultPage'
import Delivery from './Delivery'
import Takeout from './Takeout'
import { getCurrentUser } from '../../../utils/UserlocalStorage'


function Status() {

  const user = getCurrentUser()
  const TypeBought = user?.order.type
  const products = user?.order?.products

  console.log(user)
  return (
    <DefaultPage>
      {(() => {
        switch (TypeBought) {
          case 'TK':
            return <Takeout products={products}/>;

          case 'EE':
            return <Delivery products={products}/>;

        }
      })()}
    </DefaultPage>
  )
}

export default Status
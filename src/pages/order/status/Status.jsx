import React from 'react'
import DefaultPage from '../../../components/DefaultPage'
import { getCurrentUser } from '../../../utils/UserlocalStorage'

function Status() {

    const user = getCurrentUser()

    console.log(user)
  return (
    <DefaultPage>


    </DefaultPage>
  )
}

export default Status
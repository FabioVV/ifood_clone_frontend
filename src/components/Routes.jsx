import React from 'react'
import { Route, Routes, useLocation} from 'react-router-dom'
import Home from '../pages/home'


function Routes_() {

  const location = useLocation()

  return (
    <Routes>
        <Routes>
            <Route path='/' element={<Home/>} />
        </Routes>
    </Routes>
  )
}

export default Routes
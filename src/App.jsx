import { useState } from 'react'
import './index.css'
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom'
import Home from './pages/home'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Home/>} />
          </Routes>
      </Router>
    </>
  )
}

export default App

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'


function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='login' element={<Login/>} />
              <Route path='register' element={<Register/>} />
          </Routes>
      </Router>
    </>
  )
}

export default App

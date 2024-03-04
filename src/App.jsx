import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './index.css'
import Home from './pages/home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserAccount from './pages/users/edit/UserAccount'

function App() {

  return (
    <>
      <Router>
          <Routes>
              <Route path='/' element={<Home/>} />
              <Route path='login' element={<Login/>} />
              <Route path='register' element={<Register/>} />
              <Route path='minha-conta' element={<UserAccount/>} />
          </Routes>
      </Router>
    </>
  )
}

export default App

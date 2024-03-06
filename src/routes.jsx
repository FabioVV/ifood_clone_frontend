import React from 'react'
import {Route, Routes} from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserAccount from './pages/users/edit/UserAccount'
import { RequireAuth } from './components/RequireAuth'
import PersonalInfo from './pages/users/edit/PersonalInfo'
import Publicity from './pages/users/edit/publicity'
import Credentials from './pages/users/edit/Credentials'
import ContactData from './pages/users/edit/ContactData'


function _Routes() {

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />

        <Route path='minha-conta'> 

            <Route index element={
                <RequireAuth redirectTo="/login">
                    <UserAccount />
                </RequireAuth>
                
            } />

            <Route path='informacoes-pessoais' element={
                <RequireAuth redirectTo="/login">
                    <PersonalInfo />
                </RequireAuth>
            } />

            <Route path='dados-de-contato' element={
                <RequireAuth redirectTo="/login">
                    <ContactData />
                </RequireAuth>
            } />

            <Route path='credenciais' element={
                <RequireAuth redirectTo="/login">
                    <Credentials />
                </RequireAuth>
            } />

            <Route path='publicidade' element={
                <RequireAuth redirectTo="/login">
                    <Publicity />
                </RequireAuth>
            } />

        </Route>

    </Routes>
  )
}

export default _Routes
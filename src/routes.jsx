import {Route, Routes} from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserAccount from './pages/users/edit/UserAccount'
import PersonalInfo from './pages/users/edit/PersonalInfo'
import Publicity from './pages/users/edit/Publicity'
import Credentials from './pages/users/edit/Credentials'
import ContactData from './pages/users/edit/ContactData'
import PhoneGoogleRegister from './pages/auth/PhoneGoogleRegister'
import ChangeEmail from './pages/users/edit/changeEmail'
import ChangePhone from './pages/users/edit/changePhone'
import CreateRestaurant from './pages/restaurants/create/CreateRestaurant'
import CreateProduct from './pages/products/create/CreateProduct'
import RestaurantsHome from './pages/restaurants/Home'
import EditRestaurant from './pages/restaurants/edit/EditRestaurant'
import RestaurantProducts from './pages/restaurants/delivery/RestaurantProducts'
import Products from './pages/products/_list/Products'
import EditProduct from './pages/products/edit/EditProduct'
import Discover from './pages/categories/discover/Discover'
import Order from './pages/order/finalize/Order'
import QueryNav from './pages/QueryNavbar/list/QueryNav'
import IndexPayment from './pages/payment/Index'
import Status from './pages/order/status/Status'
import { RequireAuth } from './components/RequireAuth'


function _Routes() {

  return (
    <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='login' element={<Login/>} />
        <Route path='register' element={<Register/>} />
        <Route path='phone-google-register' element={<PhoneGoogleRegister/>} />

        <Route path='busca/:q' element={
            <RequireAuth redirectTo="/login">
                <QueryNav />
            </RequireAuth>
        } />

        <Route path='acompanhar-pedido' element={
            <RequireAuth redirectTo="/login">
                <Status/> 
            </RequireAuth>
        } />


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

            <Route path='email-contato' element={
                <RequireAuth redirectTo="/login">
                    <ChangeEmail />
                </RequireAuth>
            } />

            <Route path='celular-contato' element={
                <RequireAuth redirectTo="/login">
                    <ChangePhone />
                </RequireAuth>
            } />

            <Route path='pagamento' element={
                <RequireAuth redirectTo="/login">
                    <IndexPayment />
                </RequireAuth>
            } />

        </Route>

        <Route path='restaurantes' element={
            <RequireAuth redirectTo="/login">
                <RestaurantsHome />
            </RequireAuth>
        } />

        <Route path='produtos' element={
            <RequireAuth redirectTo="/login">
                <Products />
            </RequireAuth>
        } />

        <Route path='pedido/finalizar' element={
            <RequireAuth redirectTo="/login">
                <Order />
            </RequireAuth>
        } />

        <Route path='delivery/descobrir/:id/:slug' element={
            <RequireAuth redirectTo="/login">
                <Discover />
            </RequireAuth>
        } />

        <Route path='delivery/restaurante/:id/:slug' element={
            <RequireAuth redirectTo="/login">
                <RestaurantProducts />
            </RequireAuth>
        } />

        <Route path='criar-restaurante' element={
            <RequireAuth redirectTo="/login">
                <CreateRestaurant />
            </RequireAuth>
        } />

        <Route path='editar-restaurante/:id' element={
            <RequireAuth redirectTo="/login">
                <EditRestaurant />
            </RequireAuth>
        } />

        <Route path='criar-produto' element={
            <RequireAuth redirectTo="/login">
                <CreateProduct />
            </RequireAuth>
        } />

        <Route path='editar-produto/:id' element={
            <RequireAuth redirectTo="/login">
                <EditProduct />
            </RequireAuth>
        } />




    </Routes>
  )
}

export default _Routes
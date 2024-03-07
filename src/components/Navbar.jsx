import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import user_icon from '../public/img/user.svg'
import logo3 from '../public/img/logo3.png'
import { getCurrentUser, clearLocalStorage} from '../pages/auth/utils'
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";

function Navbar() {

    const [User, SetUser] = useState(getCurrentUser)

    function SignOut(){
        let navigate = useNavigate();
        googleLogout()
        clearLocalStorage()
        navigate("/"); navigate(0);
    }
    

    return (
        <div style={{padding:''}} className="navbar bg-base-100 sticky top-0 z-10">

            { User?.token ? (
                <>
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a>Item 1</a></li>
                                <li>
                                <a>Parent</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                                </li>
                                <li><a>Item 3</a></li>
                            </ul>
                        </div>

                        <div style={{maxWidth:'85px', marginLeft:'2.2rem'}}>
                            
                            <NavLink  to="/"><img width={65} height={50} src={logo3}/></NavLink>
                       
                        </div>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">

                            {/* <li><a>{getCurrentUserToken()}</a></li> */}

                        </ul>
                    </div>
                    <div className="navbar-end">

                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div style={{width:'1.5rem'}} className="rounded-full">
                                    <img width={1} height={1} src={user_icon}/>
                                </div>
                            </div>
                            <ul id='ul-dropdown-user' tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-lg dropdown-content bg-base-100 rounded-box w-80">
                                <h1 className='dropdown-title-navbar-mainmenu'>Olá, {User?.first_name}</h1>
                                <li>
                                    <NavLink  to="/minha-conta" ><i className="fa-sharp fa-solid fa-gear"></i> Seus dados</NavLink>
                                </li>
                                <li>
                                    <a onClick={() => SignOut()}><i className="fa-sharp fa-solid fa-arrow-right-from-bracket"></i> Sair</a>
                                </li>
                            </ul>
                        </div>

                        <div className="drawer-end ">
                            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                            
                            <div className="drawer-content">
                                {/* Page content here */}

                                <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        <span style={{zIndex:'0'}} className="badge badge-sm indicator-item">0</span>
                                    </div>
                                    <span style={{marginLeft:'8px'}}>R$ 0,00</span>

                               </label>
                            </div> 
                            <div className="drawer-side">
                                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">

                                    <h1 className='text-center'>Seu carrinho está vazio ); </h1>
                                    

                                    {/* <li><a>Sidebar Item 1</a></li>
                                    <li><a>Sidebar Item 2</a></li> */}
                                </ul>
                            </div>
                        </div>



                    </div>
                </> 
        
            ):(
                <>                                
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </div>
                            {/* DROPDOWN MENU FOR UNLOGGED USERS */}

                            {/* <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a>Item 1</a></li>
                                <li>
                                    <a>Parent</a>
                                    <ul className="p-2">

                                        <li><a>Lord of this world!</a></li>
                                        <li><a>So you think you can tell heaven from hell?</a></li>

                                    </ul>
                                </li>
                                <li><a>Item 3</a></li>
                            </ul> */}
                        </div>
                        <div style={{maxWidth:'85px', marginLeft:'2.2rem'}}>
                            
                            <NavLink  to="/"><img width={350} height={50} src={logo3}/></NavLink>
                       
                        </div>

                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">

                            {/* <li><a>Lord of this world!</a></li>
                            <li><a>So you think you can tell..... heaven from hell?</a></li> */}

                        </ul>
                    </div>
                    <div style={{marginRight:'2.2rem'}} className="navbar-end gap-3">
                        <NavLink className='btn btn-ghost' to="/register">Criar conta</NavLink>
                        <NavLink className='btn btn-neutral' to="/login">Login</NavLink>
                    </div>
                </>
            )
            }

        </div>

        
    )
}

export default Navbar
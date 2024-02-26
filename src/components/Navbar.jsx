import React from 'react'
import { NavLink, useNavigate  } from 'react-router-dom'
import { getCurrentUserToken, getCurrentUser, clearLocalStorage } from '../pages/auth/utils'
import { googleLogout } from '@react-oauth/google';



function Navbar() {
    
    const navigate = useNavigate();

    function SignOut(){
        let user = getCurrentUser()

        if(user['is_google_user']){
            googleLogout()
        }

        clearLocalStorage()
        navigate("/"); navigate(0);
    }
    
    return (
        <div style={{padding:'18px'}} className="navbar bg-base-100 sticky top-0 z-10 ">
            { getCurrentUserToken() ? (
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
                        

                        <ul className="menu menu-horizontal px-1">

                            <li>
                                <a>
                                    <NavLink className="btn btn-ghost text-4xl"  to="/">Bytefood</NavLink>
                                </a>
                            </li>

                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            {/* <li><NavLink  className=""  to="/restaurantes">Restaurantes</NavLink></li> */}
                            {/* <li>
                                <details>
                                <summary>Parent</summary>

                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>

                                </details>
                            </li> */}
                            <li>
                                <a>
                                    <NavLink className="" >Inicio</NavLink>
                                </a>
                            </li>

                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>                            <li>
                                <a>
                                    <NavLink className="" >teste</NavLink>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <button className="btn" onClick={() => SignOut()}>Sair</button>
                    </div>
                </> 
        
            ):(
                <>
                    <div className="navbar-start justify-center">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </div>
                            {/* <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><a>Item 1</a></li>
                                <li>
                                <a>Parent</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                                </li>
                                <li><a>Item 3</a></li>
                            </ul> */}
                        </div>
                        <NavLink className="btn btn-ghost text-4xl"  to="/">Bytefood</NavLink>
                    </div>
                    <div className="navbar-end justify-center">
                        <NavLink className="btn mr-5" to="/register">Criar conta</NavLink>
                        <NavLink className="btn" to="/login">Login</NavLink>
                    </div>
                </>
            )
            }

        </div>

        
    )
}

export default Navbar
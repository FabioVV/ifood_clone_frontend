import React from 'react'
import { NavLink, useNavigate  } from 'react-router-dom'
import { getCurrentUserToken, getCurrentUser, clearLocalStorage } from '../pages/auth/utils'
import { googleLogout } from '@react-oauth/google';
import logo1 from '../public/img/logo1.png'
import logo2 from '../public/img/logo2.png'
import logo3 from '../public/img/logo3.png'


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
        <div style={{padding:''}} className="navbar bg-base-100 sticky top-0 z-10 ">

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
                        <NavLink className="btn btn-ghost text-xl" to="/">byteFood</NavLink>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">

                            <li><a>{getCurrentUserToken()}</a></li>
                            <li><a>Something in the way...</a></li>
                            <li><a>Wait till their judgement day comes, yeah!</a></li>

                        </ul>
                    </div>
                    <div className="navbar-end">
                        <button className="btn" onClick={() => SignOut()}>Sair</button>
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

                            <li><a>Lord of this world!</a></li>
                            <li><a>So you think you can tell heaven from hell?</a></li>

                        </ul>
                    </div>
                    <div  className="navbar-end gap-3">
                        <NavLink className='btn' to="/register">Criar conta</NavLink>
                        <NavLink className='btn' to="/login">Login</NavLink>
                    </div>
                </>
            )
            }

        </div>

        
    )
}

export default Navbar
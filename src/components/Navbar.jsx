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
            <div className="flex-1">
                <NavLink className='btn btn-ghost text-xl' to="/">byteFood</NavLink>
            </div>
            
            
            { getCurrentUserToken() ? (
                <>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">

                            
                            <li><a>Link</a></li>


                            <li>
                                <details>
                                    <summary>
                                        Parent
                                    </summary>
                                <ul className="p-2 bg-base-100 rounded-t-none">
                                    <li><a>Link 1</a></li>
                                    <li><a>Link 2</a></li>
                                </ul>
                                </details>
                            </li>
                        </ul>
                    </div>
                </> 
        
            ):(
                <>
                    <div className="flex-none">
                        <ul className="menu menu-horizontal px-1">

                            <li><NavLink to="/register">Criar conta</NavLink></li>
                            <li><NavLink to="/login">Login</NavLink></li>

                            
                            
                            <li>
                                <details>
                                    <summary>
                                        Parent
                                    </summary>
                                <ul className="p-2 bg-base-100 rounded-t-none">
                                    <li><a>Link 1</a></li>
                                    <li><a>Link 2</a></li>
                                </ul>
                                </details>
                            </li>
                        </ul>
                    </div>
                </>
            )
            }

        </div>

        
    )
}

export default Navbar
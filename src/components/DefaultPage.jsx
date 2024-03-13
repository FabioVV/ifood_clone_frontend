import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/UserlocalStorage";

export default function DefaultPage(props) {
  let navigate = useNavigate();


  useEffect(()=>{

    let Phone = getCurrentUser() ? getCurrentUser()['phone'] : ""

    if(!Phone && getCurrentUser()){
      navigate('/phone-google-register')
    }

  },[])


  return (
   <div className='main-container'>

      <Navbar/>
      
      <main>
        {props.children}
      </main>
      
      <Footer/>
    
    </div>
  )
  
}
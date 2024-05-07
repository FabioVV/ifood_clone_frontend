import React, { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/UserlocalStorage";

export default function DefaultPage(props) {
  let navigate = useNavigate();


  useEffect(()=>{

    const Phone = getCurrentUser() ? getCurrentUser()['phone'] : ""
    const active_order = getCurrentUser() ? getCurrentUser()['order'] : ""


    if(!Phone && getCurrentUser()){
      navigate('/phone-google-register')
    } 

    // if(active_order && getCurrentUser()){
    //   navigate('/acompanhar-pedido')
    // } 


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
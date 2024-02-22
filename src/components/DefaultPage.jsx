import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'


export default function DefaultPage(props) {

  return (
   <>

    <Navbar/>
        {props.children}
    <Footer/>
    
   </>
  )
  
}
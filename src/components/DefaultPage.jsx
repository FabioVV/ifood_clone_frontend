import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'


export default function DefaultPage(props) {

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
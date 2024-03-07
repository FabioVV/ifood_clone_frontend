import { useEffect } from 'react'
import { useState } from 'react'


function Alert({message, type}) {

    // const [Show, SetShow] = useState("flex")
    // const TIME = 5000
    // useEffect(()=>{
    //     window.scrollTo({top: 0, behavior: 'smooth'});
    //     setTimeout(()=>{
    //         SetShow("none")
    //     }, TIME)
    // }, [])


    return (
        <div style={{display:'flex', justifyContent:'center'}} role="alert" className={`alert ${type}`}>
            {type == 'alert-success' ? 
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>

            :
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }

            {message ? <span>{message}</span> : <span></span>}

            <span></span>
        </div>
    )
}



export default Alert
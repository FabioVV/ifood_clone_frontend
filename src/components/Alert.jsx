
export default function Alert({message, type}) {

    return (
        <>
            {type == 'alert-success' ? 
                <div style={{display:'flex', justifyContent:'center', color:'white', backgroundColor:'#50a773', borderRadius:'0', position:'absolute', top:'0', zIndex:'100', height:'90px'}} role="alert" className={`alert ${type}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    
                    {message ? <span>{message}</span> : <span></span>}
    
                    <span></span>
                </div>
            :
            <div style={{display:'flex', justifyContent:'center', color:'white', borderRadius:'0', position:'absolute', top:'0', zIndex:'100', height:'90px'}} role="alert" className={`alert ${type}`}>

                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            
                {message ? <span>{message}</span> : <span></span>}

                <span></span>
            </div>
            }

        </>
    )
}

import React from 'react'
import { useState } from 'react'
import { getCurrentUserToken } from '../utils/UserlocalStorage'
import Alert from './Alert';
import { show_flash_message } from '../utils/FlashMessages';

function DeleteRestaurant({restaurant_id, HandleFetch}) {

    const [submitting, setSubmitting] = useState(false)
    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })

    const DeactivateRestaurant = async() => {
        setSubmitting(true)

        try{
            const response = await fetch(`http://127.0.0.1:8000/api/v1/restaurants/${restaurant_id}/`,{
                method:"DELETE",
    
                headers: { 
                    "Content-Type":"application/json", Authorization:` Token ${getCurrentUserToken()}`
                }
            })

            if(response.ok){

                HandleFetch()
                //show_flash_message(setShowAlert, ShowAlert, 'Restaurante removido', 'alert-success')
    
            } else {
                show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
            }
    
        } catch(err) {
            console.log(err)

        } finally {
            setSubmitting(false)
            document.getElementById('close').click()

        }
        
    } 
    
    


  return (
    <>
        {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

        <dialog id={`my_modal_delete_restaurant_${restaurant_id}`} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>Você tem certeza?
                    
                </h3>
                <p className="py-4">Está ação ira <span className='text-red-600'>remover</span> o restaurante.</p>
                <div className="modal-action">

                    <button disabled={submitting} onClick={() => DeactivateRestaurant()} type="button" className="btn text-red-600">
                        {submitting ? <span className="loading loading-spinner loading-lg"></span> : 'Remover restaurante'}
                    </button>

                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button id='close' className="btn">Fechar</button>
                    </form>
                </div>
            </div>
        </dialog>
    </>
  )
}

export default DeleteRestaurant
import React, {useState, useEffect} from 'react'
import Address from '../pages/addresses/_list/Address'
import { getCurrentUser, getCurrentUserToken } from '../utils/UserlocalStorage'

function AddressesList({data, HandleFetch}){
    return (
      <>
        {data?.map((address) => (
            <Address
              key={address.id}
              address={address}
              HandleFetch={HandleFetch}
            />
        ))}
      </>
    )
}



function Addresses({SetSelectedAddress}) {

    const [User] = useState(getCurrentUser)

    const [isLoading, setIsLoading] = useState(false)
    const [Addresses, SetAddresses] = useState([])

    async function get_addresses(url = 'http://127.0.0.1:8000/api/v1/addresses/user-addresses/'){
        try{

            const response = await fetch(url, {
                method:'GET',
                headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
            })

            if(response.ok){
                const data = await response.json()
                SetAddresses(data)
                SetSelectedAddress(data.find(item => item.is_selected))

            } 

        } catch(e){
            console.log(e.message)

        } finally{
            setIsLoading(false)

        }

    }


    useEffect(()=>{

        get_addresses()

    },[])

  return (
    <>
        { isLoading ?
            <span className="loading loading-spinner loading-lg"></span>
            :
            <AddressesList data={Addresses} HandleFetch={get_addresses}/>
        }
    </>
  )
}

export default Addresses
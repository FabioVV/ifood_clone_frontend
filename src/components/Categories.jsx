import React, {useState, useEffect} from 'react'
import { getCurrentUser, getCurrentUserToken } from '../utils/UserlocalStorage'
import Category from './Category'


function CategoriesList({data, HandleFetch}){
    return (
      <>
        {data?.map((category) => (
            <Category
              key={category.id}
              category={category}
              HandleFetch={HandleFetch}
            />
        ))}
      </>
    )
  }

function Categories() {

    const [user, SetUser] = useState(getCurrentUser)
    const [Categories, SetCategories] = useState([])
    const [leftPosition, setLeftPosition] = useState(0); 
    const [isLoading, setIsLoading] = useState(false)


    function moveLeft() {
        setLeftPosition(prevPosition => prevPosition - 90); 
    }

    function moveRight() {
        setLeftPosition(prevPosition => prevPosition + 90); 
    }


    const fetchCategories = async (url = 'http://127.0.0.1:8000/api/v1/categories/available-categories/') => {
        setIsLoading(true)
        const response = await fetch(url, {
          method:'GET',
          headers:{ Authorization:` Token ${getCurrentUserToken()}`, 'Content-Type': 'application/json'},
        })
    
    
        if(response.ok){
            const data = await response.json()
            SetCategories(data)
        } 
        setIsLoading(false)
      }
    
    
      useEffect(()=>{fetchCategories();},[user])


  return (
    <div id='main-categories'>
        <i onClick={moveLeft} id='moveLeft'  style={{display:'flex', alignItems:'center'}} className="fa-solid fa-chevron-left arrow hv"></i>

            <div id='categories' style={{ left: `${leftPosition}px`}}>
                <CategoriesList data={Categories} HandleFetch={fetchCategories} />
            </div>

        <i onClick={moveRight} id='moveRight'  style={{display:'flex', alignItems:'center'}} className="fa-solid fa-chevron-right arrow hv"></i>
    </div>
  )
}

export default Categories
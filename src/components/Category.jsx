import React from 'react'
import { NavLink } from 'react-router-dom'


function Category({category, HandleFetch}) {



  return (
    <div id='category' >

      <div id='image-container' className='rounded-lg  overflow-hidden'>
        {/* FAZER UM IF AQUI PARA CHECAR SE O LINK EXISTE {category?.image ?}, PARA ELE NAO FAZER REQUISIÇÕES PROS SERVIDORES TODA VEZ */}
        <img width={95} height={95} src={`http://localhost:8000${category?.image ? category?.image :'/media/_default/category_default.jpg'}`} alt={`Imagem da categoria ${category?.name}`} className='rounded-lg overflow-hidden'/>
      </div>

      <div id="content">
        <h3 id='title'>

          <div id='title-header'>
            <span id='title-name'>{category.name}</span>
          </div>
          
        </h3>
      </div>

    </div>
  )
}

export default Category
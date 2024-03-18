import React, {useState} from 'react'
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';
import Asynchronous from '../../../components/AsyncProductSearch';

import { getCurrentUserToken, getCurrentUser } from '../../../utils/UserlocalStorage';
import DefaultPage from '../../../components/DefaultPage'
import Alert from '../../../components/Alert'
import { show_flash_message } from '../../../utils/FlashMessages'

function CreateProduct() {

    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

    const [isLoading, setIsLoading] = useState(false)
    const [ShowAlert, setShowAlert] = useState({
        show: false,
        message:'',
        type:'',
    })

    
    let navigate = useNavigate();

    const [Product, setProduct] = useState({
        name:'',
        description:'',
        price:'',
        qtd:'',
        image:'',
        restaurant_id:''
    })

    async function onSubmit(form, event){

        event.preventDefault()
        setIsLoading(true)

        let form_data_product = new FormData();


        if (Product.image){
            form_data_product.append("image", Product.image, Product.image.name);
        }
        form_data_product.append("name", Product.name);
        form_data_product.append("description", Product.description);
        form_data_product.append("price", Product.price);
        form_data_product.append("qtd", Product.qtd);
        form_data_product.append("restaurant_id", Product.restaurant_id);

        try{

            const res = await fetch("http://127.0.0.1:8000/api/v1/products/register-product/",{
                method:"POST",
                headers:{
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:form_data_product,
            })

            if (!res.ok) {
                show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
            } 
            
            const product_created = await res.json()

            if(product_created['id']){
                show_flash_message(setShowAlert, ShowAlert, 'Produto criado com sucesso', 'alert-success')
            }

            if(product_created['restaurant_does_not_exist']){
                setError('restaurant_id', {
                    type: 'restaurant_does_not_exist',
                    message: product_created['restaurant_id']
                })
                setIsLoading(false)
            }

            
            setIsLoading(false)
        } catch(error){

            show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')

            console.log(errors)
            setIsLoading(false)

        }

    }


  return (
    <DefaultPage>
        {ShowAlert?.show ? <Alert message={`${ShowAlert?.message}`} type={`${ShowAlert?.type}`}/>: ""}

        <div className='container-user-info' style={{margin:'20px auto'}}>
            <ul style={{width:'75ch'}}>
                <li>
                    <form method='post' onSubmit={handleSubmit(onSubmit)} style={{justifyContent:'center'}} id='form' className="card-body gap-4 text-black" encType='multipart/form-data'>
                        <label className="text-5xl mb-5"> 
                            Registre um produto
                        </label>

                        Nome
                        <input name="name" id='name' type="text" className="input input-bordered input-md w-full max-w" placeholder="Coca-cola lata" 
                            {...register("name", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setProduct({...Product, name:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Restaurante
                        {/* <Asynchronous/>  
                        UTILIZAR ESSE AQUI PARA MOSTRAR OS RESTAURANTES QUE O USUARIO STAFF PODE UTILIZAR PARA CADASTRAR OS PRODUTOS DO SEU RESTAURANTE*/}
                        <input name="restaurant_id" id='restaurant_id' type="text" className="input input-bordered input-md w-full max-w" placeholder="Coca-cola lata" 
                            {...register("restaurant_id", { required: "Campo obrigatório.", maxLength:{value:75, message:'Máximo de 75 caracteres'}, minLength:{value:1, message:'Necessita no minímo 1 caracteres '}, onChange: (e) => {setProduct({...Product, restaurant_id:e.target.value})}, })}
                        /> 

                        <ErrorMessage
                            errors={errors}
                            name="restaurant_id"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Preço
                        <label className="input input-bordered flex items-center gap-2">
                            
                            <CurrencyInput
                                intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                                id="price"
                                name="price"
                                placeholder="Digite um preço"
                                // defaultValue={1}
                                decimalsLimit={2}
                                decimalSeparator="," 
                                groupSeparator="."
                                onValueChange={(value) => {setProduct({...Product, price:value})}}
                                {...register("price", { required: "Campo obrigatório."})}
                            />
                        </label>

                        <ErrorMessage
                            errors={errors}
                            name="price"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />
                        
                        Descrição
                        <input name="description" id='description' type="text" className="input input-bordered input-md w-full max-w" placeholder="Refrigerante lata" 
                            {...register("description", { required: "Campo obrigatório.", maxLength:{value:100, message:'Máximo de 100 caracteres'}, minLength:{value:3, message:'Necessita no minímo 3 caracteres '}, onChange: (e) => {setProduct({...Product, description:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="description"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Quantidade
                        <input name="qtd" id='qtd' type="number" className="input input-bordered input-md w-full max-w" placeholder="50" 
                            {...register("qtd", { required: "Campo obrigatório.",min:{value:1, message:'Precisa existir pelo menos um produto em estoque'}, valueAsNumber:true, onChange: (e) => {setProduct({...Product, qtd:e.target.value})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="qtd"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        Imagem
                        <input name="image" id='image' type="file" className="file-input w-full max-w-xs"  accept="image/jpeg,image/png,image/gif"
                            {...register("image", { required: "Campo obrigatório.", onChange: (e) => {setProduct({...Product, image:e.target.files[0]})}, })}
                        />

                        <ErrorMessage
                            errors={errors}
                            name="image"
                            render={({ message }) => 
                            <div className="text-red-400 px-2 py-1 rounded relative" role="alert" id='email-message'>
                                <strong className="font-bold">* {message}</strong>
                            </div>}
                        />

                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Criar'}

                        </button>

                        <button type='button' disabled={isLoading} onClick={() => {navigate('/')}} className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Voltar'}

                        </button>
                        

                    </form>
                </li>
            </ul>
        </div>

    </DefaultPage>
  )
}

export default CreateProduct
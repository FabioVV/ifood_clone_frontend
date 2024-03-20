import {useEffect, useState} from 'react'
import DefaultPage from '../../../components/DefaultPage';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from "react-router-dom";
import { getCurrentUserToken } from '../../../utils/UserlocalStorage';
import Alert from '../../../components/Alert';
import { show_flash_message } from '../../../utils/FlashMessages';
import CurrencyInput from 'react-currency-input-field';
import { useParams } from "react-router-dom";
import AsynchronousProductCategories from '../../../components/AsyncProductCategory';
import AsynchronousRestaurants from '../../../components/AsyncProductRestaurant';



function EditProduct() {
    const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

    const { id } = useParams();

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
        restaurant_id:'',
        restaurant_name:'',

        categories: []
    })


    const[ProductCurrentImage, setProductCurrentImage] = useState('')
        
    useEffect(()=>{
        async function getProduct() {
            setIsLoading(true)

            try{
                const res = await fetch(`http://127.0.0.1:8000/api/v1/products/get/${id}/`,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json", 
                        Authorization:` Token ${getCurrentUserToken()}`,
                    },
                })
        
                if (!res.ok) {
                    show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
                }

                
                const product = await res.json()
        
    
                if(product['name']){
                    setProduct(
                        {
                            id:id,
                            name:product.name,
                            description:product.description,
                            price:product.price,
                            qtd:product.qtd,
                            restaurant_id:product.restaurant_id,
                            categories:product.categories,
                            restaurant_name:product.restaurant_name,

                        }
                    )
                    setProductCurrentImage(product.image)

                    reset({...product})
                }
    
    
            } catch(error){
                console.log(error)
    
            } finally{
                setIsLoading(false)

            }
    
        }

        if(id)getProduct()
    }, [id])

    



    async function onSubmit(form, event){

        event.preventDefault()
        setIsLoading(true)

        let form_data_restaurant = new FormData();



        form_data_restaurant.append("restaurant_id", Restaurant.id);

        if (Restaurant?.logo){
            form_data_restaurant.append("logo", Restaurant.logo, Restaurant.logo.name);
        }
        form_data_restaurant.append("name", Restaurant.name);
        form_data_restaurant.append("description", Restaurant.description);
        form_data_restaurant.append("street", Restaurant.street);
        form_data_restaurant.append("neighborhood", Restaurant.neighborhood);
        form_data_restaurant.append("complement", Restaurant.complement);
        form_data_restaurant.append("city", Restaurant.city);
        form_data_restaurant.append("state", Restaurant.state);
        form_data_restaurant.append("number", Restaurant.number);
        form_data_restaurant.append("zip_code", Restaurant.zip_code);
        form_data_restaurant.append("cnpj", Restaurant.cnpj);
        form_data_restaurant.append("delivery_fee", Restaurant.delivery_fee);

        try{

            let blank_fields = 0
            Object.entries(Restaurant).forEach(([key, val]) => {
                if(val == '' || val == undefined || val == null){
                    setError(key, {
                        type: 'blank_field',
                        message:'Campo obrigatório'
                    })
                    setIsLoading(false)
                    blank_fields++
                } else {
                    blank_fields--
                }   
            });
            

            if(blank_fields > 0){setIsLoading(false); window.scrollTo({top: 0, behavior: 'smooth'}); return false; }

            const res = await fetch("http://127.0.0.1:8000/api/v1/restaurants/update-restaurant/",{
                method:"PATCH",
                headers:{
                    Authorization:` Token ${getCurrentUserToken()}`,
                },
    
                body:form_data_restaurant,
            })

            if (!res.ok) {
                show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')
            } 
            
            const restaurant_result = await res.json()

            if(restaurant_result['id']){
                show_flash_message(setShowAlert, ShowAlert, 'Restaurante atualizado com sucesso', 'alert-success')
            }            

            
        } catch(error){

            show_flash_message(setShowAlert, ShowAlert, 'Oh não. Um erro ocorreu com a sua solicitação', 'alert-error')

            console.log(error)
            setIsLoading(false)

        } finally {
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
                            Alteração do produto <span style={{fontWeight:'500'}}>{Product?.name} </span>
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
                        <AsynchronousRestaurants
                            fn_set_id={setProduct}
                            fn_object={Product}
                        />  

                        Categorias
                        <AsynchronousProductCategories
                            fn_set_id={setProduct}
                            fn_object={Product}
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
                                //defaultValue={1}
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

                        Imagem atual
                        <div id='image-container' className='rounded-lg  overflow-hidden'>
                            <img width={170} height={170} src={`http://localhost:8000${ProductCurrentImage}`} alt={`Imagem do produto ${Product?.name}`} className='rounded-lg overflow-hidden'/>
                        </div>

                        <button disabled={isLoading} type='submit' className="btn btn-outline">
                            
                            {isLoading ? <span className="loading loading-spinner loading-lg"></span>: 'Salvar'}

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

export default EditProduct
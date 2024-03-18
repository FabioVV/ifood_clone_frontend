export default async function searchCEP(fn_state, Object, cep_loading_fn){

    // EXEMPLO DE RETORNO
    // "cep": "01001-000",
    // "logradouro": "Praça da Sé",
    // "complemento": "lado ímpar",
    // "bairro": "Sé",
    // "localidade": "São Paulo",
    // "uf": "SP",
    // "ibge": "3550308",
    // "gia": "1004",
    // "ddd": "11",
    // "siafi": "7107"

    try{
        cep_loading_fn(true)

        const response = await fetch(`https://viacep.com.br/ws/${Object?.zip_code}/json/`, {
            method: "GET",
        })

        const result = await response.json();

        fn_state({...Object, 
        
            street:result['logradouro'],
            neighborhood:result['bairro'],
            complement:result['complemento'],
            city:result['localidade'],
            state:result['uf'],

        })

        document.getElementById('street').value = Object?.street
        document.getElementById('neighborhood').value =  Object?.neighborhood
        document.getElementById('complement').value =  Object?.complement
        document.getElementById('city').value =  Object?.city
        document.getElementById('state').value =  Object?.state

        cep_loading_fn(false)

    } catch(error){
        console.log("VIACEP ERROR -> " + error)
        cep_loading_fn(false)

    }
}
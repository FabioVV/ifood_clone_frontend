
export function setCart(){
    try{
        localStorage.setItem('bytefood_cart', JSON.stringify([]))

    } catch(error){
        console.log("Error setting cart ->" + error)
    }
}


export function totalPriceCart(products){
    try{
        let total_price = 0.00
        
        products.forEach(element => {
            total_price += parseFloat(element.price)
        });


        return parseFloat(total_price).toFixed(2).toString().replace('.',',')

    } catch(error){
        console.log("Error updating cart ->" + error)
    }
}

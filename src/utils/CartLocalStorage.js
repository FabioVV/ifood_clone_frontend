
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

        products.forEach(product => {

            if(product.product_quantity_choosen && product.product_quantity_choosen > 1){
                
                total_price += parseFloat(product.new_price)

            } else{
                total_price += parseFloat(product.price)

            }

        });

        return parseFloat(total_price).toFixed(2).toString().replace('.',',')

    } catch(error){
        console.log("Error updating cart ->" + error)
    }
}

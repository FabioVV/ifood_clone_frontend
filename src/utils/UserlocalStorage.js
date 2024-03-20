function ExpiredLocalStorage(){

    let expiration_date = undefined

    if (localStorage.getItem("userBytefood") != null) {
        expiration_date = JSON.parse(localStorage.getItem('userBytefood'))['expiration']
    } else {
        console.log('EXP_Error')
    }


    let now = new Date()
    if (expiration_date != undefined && now.getTime() > expiration_date){
        // Problably overkill
        removeCurrentUser()
        
        // Removes user and all of his data (cart etc) from localstorage
        clearLocalStorage()

    }

}


export function getCurrentUser(){
    try{

        if (localStorage.getItem("userBytefood") != null) {
            return JSON.parse(localStorage.getItem('userBytefood'))
        }else {
            return null
        }

    } catch(error){
        console.log("Error retrieving user ->" + error)
    }
}

export function getCurrentUserToken(){
    try{
        if (localStorage.getItem("userBytefood") != null) {
            return JSON.parse(localStorage.getItem('userBytefood'))['token']
        } else {
            return null
        }
        
    } catch(error){
        console.log("Error retrieving user ->" + error)
    }
}

export function setCurrentUser(user, token){
    try{

        Object.assign(user, {token:token})

        //EXPIRATION TIME FOR LOCALSTORAGEDATA
        Object.assign(user, {expiration:new Date().getTime()+ (60000 * 30)})

        localStorage.setItem('userBytefood', JSON.stringify(user))


    } catch(error){
        console.log("Error setting user ->" + error)
    }
}


export function updateCurrentUser(user_new_data){
    try{
        let user = getCurrentUser()
        
        Object.entries(user).forEach(([key, val]) => {
            if(user_new_data[key]){
                user[key] = user_new_data[key]
            }
        });
        removeCurrentUser()

        //EXPIRATION TIME FOR LOCALSTORAGEDATA
        Object.assign(user, {expiration:new Date().getTime()+ (60000 * 30)})
        localStorage.setItem('userBytefood', JSON.stringify(user))


    } catch(error){
        console.log("Error updating user ->" + error)
    }
}


export function removeCurrentUser(){
    try{

        if (localStorage.getItem("userBytefood") != null) {
            localStorage.removeItem('userBytefood')
        }

    } catch(error){
        console.log("Error removing user ->" + error)
    }
}

export function clearLocalStorage(){
    try{
        
        localStorage.clear()

    } catch(error){
        console.log("Error clearing local storage ->" + error)
    }
}

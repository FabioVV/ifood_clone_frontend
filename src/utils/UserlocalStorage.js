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

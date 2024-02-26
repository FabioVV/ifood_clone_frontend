import { getCurrentUserToken } from "../pages/auth/utils"
import { redirect } from "react-router-dom"

const withAuth = (Component) => {
    const AuthRoute = () =>{
        const isAuth = !!getCurrentUserToken()

        if (isAuth) {
            return <Component />;
          } else {
            return <redirect to="/" />;
          }
    }

    return AuthRoute
}



/*
EXEMPLO DE USO

import withAuth from "../components/withAuth";

const Profile = () => {
 // ...
}

export default withAuth(Profile);

*/
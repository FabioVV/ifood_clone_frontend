import { useNavigate } from "react-router-dom";
import { getCurrentUserToken } from "../pages/auth/utils";

export function RequireAuth({ children, redirectTo }) {
    let navigate = useNavigate();

    let isAuthenticated = getCurrentUserToken();
    return isAuthenticated ? children : navigate(redirectTo);
}
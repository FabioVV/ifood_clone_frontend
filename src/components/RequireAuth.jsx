import { useNavigate } from "react-router-dom";
import { getCurrentUserToken } from "../utils/UserlocalStorage";

export function RequireAuth({ children, redirectTo }) {
    let navigate = useNavigate();

    return getCurrentUserToken() ? children : navigate(redirectTo);
}
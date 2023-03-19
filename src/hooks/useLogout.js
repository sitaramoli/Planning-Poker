import { useNavigate } from "react-router-dom";

const useLogout = () => {
    const navigate = useNavigate();
    const logout = () => {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("moderator");
        window.localStorage.removeItem("member");
        navigate('/login', { replace: true });
    }

    return { logout };
}

export { useLogout };
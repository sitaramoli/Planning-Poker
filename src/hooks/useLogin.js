import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();


    // Check if user has already logged in
    useEffect(() => {
        if (window.localStorage.getItem("user")) {
            navigate('/', { replace: true });
        }
    }, [])

    const onVisibilityChange = () => {
        setVisible(!visible);
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleFormSubmit = () => {
        let errors = {};
        if (!formData.email) {
            errors.email = 'Email is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }
        else {
            setFormErrors({});
            login();
        }

    }

    const login = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1/poker_planning/login", formData);
            const data = response.data;
            if (data.success === 1) {
                window.localStorage.setItem("user", JSON.stringify(data.data));
                navigate('/', { replace: true });
            }
            else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);

        }
    }

    return { loading, formData, visible, onVisibilityChange, onInputChange, handleFormSubmit, formErrors };


}

export default useLogin;
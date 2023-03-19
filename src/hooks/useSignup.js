import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm_password: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    /**
     * goto home page if already authenticated
     */
    useEffect(() => {
        if (window.localStorage.getItem("user")) {
            navigate('/', { replace: true });
        }
    }, [])

    const onPasswordVisibilityChange = () => {
        setPasswordVisible(!passwordVisible);
    }
    const onConfirmVisibilityChange = () => {
        setConfirmVisible(!confirmVisible);
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleFormSubmit = () => {
        let errors = {};
        if (!formData.name) {
            errors.name = 'Full name is required';
        }
        if (!formData.email) {
            errors.email = 'Email is required';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        }
        if (!formData.confirm_password || formData.password !== formData.confirm_password) {
            errors.confirm_password = 'Passwords don\'t match';
        }
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }
        else {
            setFormErrors({});
            signup();
        }
    }

    const signup = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1/poker_planning/signup", formData);
            const data = response.data;
            if (data.success === 1) {
                toast.success(data.message);
                navigate('/login', { replace: true });
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


    return { formErrors, loading, formData, onInputChange, handleFormSubmit, passwordVisible, onPasswordVisibilityChange, confirmVisible, onConfirmVisibilityChange };
}

export default useSignup;
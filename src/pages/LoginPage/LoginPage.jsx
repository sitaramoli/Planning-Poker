import './LoginPage.scss';

import React from 'react'
import InputField from '../../components/InputField/InputField';
import useLogin from '../../hooks/useLogin';
import AuthButton from '../../components/AuthButton/AuthButton';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

    const navigate = useNavigate();
    const signupRoute = () => {
        navigate('/signup', { replace: true });
    }

    const { loading, formData, visible, onVisibilityChange, onInputChange, handleFormSubmit, formErrors } = useLogin();

    return (
        <div className='login'>
            <div className='login__header'>
                <h2 className="login__header__title">Welcome Back!</h2>
                <p className="login__header__subtitle">Enter your email and password below</p>
            </div>
            <form action="" className="login__form">
                <InputField label={'Email'} type={'text'} name={'email'} value={formData.email} onChange={onInputChange} placeholder={'Email address'} errorMessage={formErrors.email} required={true} />
                <InputField label={'Password'} isPassword={true} type={visible ? 'text' : 'password'} name={'password'} value={formData.password} onChange={onInputChange} onVisibilityChange={onVisibilityChange} placeholder={'Password'} errorMessage={formErrors.password} required={true} />
                {loading ? <LoadingSpinner /> : <AuthButton text={'Log In'} type={'button'} onClick={handleFormSubmit} />}
            </form>
            <div className="login__footer">
                <span>Don’t have an account?</span>
                <span className='login__footer__signup' onClick={signupRoute} >Sign up</span>
            </div>
        </div>
    )
}

export default LoginPage;
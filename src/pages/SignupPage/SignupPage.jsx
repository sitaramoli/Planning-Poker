import React from 'react'
import { useNavigate } from 'react-router-dom';
import AuthButton from '../../components/AuthButton/AuthButton';
import InputField from '../../components/InputField/InputField';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import useSignup from '../../hooks/useSignup';

import './SignupPage.scss';

const SignupPage = () => {

    const navigate = useNavigate();
    const loginRoute = () => {
        navigate('/login', { replace: true });
    }

    const { loading, formErrors, formData, onInputChange, handleFormSubmit, passwordVisible, onPasswordVisibilityChange, confirmVisible, onConfirmVisibilityChange } = useSignup();

    return (
        <div className='signup'>
            <div className="signup__header">
                <h2 className="signup__header__title">Let’s Join!</h2>
                <p className="signup__header__subtitle">Create an account to continue</p>
            </div>
            <form action="" className="signup__form">
                <InputField required={true} label={'Fullname'} type={'text'} name={'name'} value={formData.fullname} onChange={onInputChange} placeholder={'Fullname'} errorMessage={formErrors.name} />
                <InputField required={true} label={'Email'} type={'email'} name={'email'} value={formData.email} onChange={onInputChange} placeholder={'Email address'} errorMessage={formErrors.email} />
                <InputField required={true} label={'Password'} isPassword={true} type={passwordVisible ? 'text' : 'password'} name={'password'} value={formData.password} onChange={onInputChange} onVisibilityChange={onPasswordVisibilityChange} placeholder={'Password'} errorMessage={formErrors.password} />
                <InputField pattern={formData.password} required={true} label={'Confirm Password'} isPassword={true} type={confirmVisible ? 'text' : 'password'} name={'confirm_password'} value={formData.confirm_password} onChange={onInputChange} onVisibilityChange={onConfirmVisibilityChange} placeholder={'Confirm password'} errorMessage={formErrors.confirm_password} />
                {loading ? <LoadingSpinner /> : <AuthButton text={'Sign up'} type={'button'} onClick={handleFormSubmit} />}
            </form>
            <div className="signup__footer">
                <span>Already have an account?</span>
                <span className='signup__footer__login' onClick={loginRoute}>Log in</span>
            </div>
        </div>
    )
}

export default SignupPage;
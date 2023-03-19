import './InputField.scss';

import React from 'react'

const InputField = ({ type, label, isPassword, onVisibilityChange, errorMessage, ...rest }) => {
    return (
        <div className='input'>
            <label className='input__label'>{label}</label>
            <input type={type} {...rest} />
            <span className='input__errorMessage'>{errorMessage}</span>
            {isPassword && <i className={`input__icon ${type === 'text' ? 'icon-visibility-on' : 'icon-visibility-off'}`} onClick={onVisibilityChange}></i>}
        </div>
    )
}

export default InputField;
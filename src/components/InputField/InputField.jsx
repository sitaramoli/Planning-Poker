import './InputField.scss';

import React from 'react'

const InputField = ({ pattern, label, type, isPassword, name, id, value, onChange, onVisibilityChange, placeholder, required, errorMessage }) => {
    return (
        <div className='input'>
            <label className='input__label'>{label}</label>
            <input pattern={pattern} type={type} name={name} id={id} value={value} onChange={onChange} placeholder={placeholder} required={required} />
            <span className='input__errorMessage'>{errorMessage}</span>
            {isPassword && <i className={`input__icon ${type === 'text' ? 'icon-visibility-on' : 'icon-visibility-off'}`} onClick={onVisibilityChange}></i>}
        </div>
    )
}

export default InputField;
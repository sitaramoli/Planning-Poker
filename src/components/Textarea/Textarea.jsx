import React from 'react';
import './Textarea.scss';

const Textarea = ({ name, label, errorMessage, ...rest }) => {
    return (
        <div className='textarea'>
            <label className='textarea__label' htmlFor={name}>{label}</label>
            <textarea name={name} id={name} cols="30" rows="5" {...rest}></textarea>
            <span className='textarea__errorMessage'>{errorMessage}</span>
        </div>
    )
}

export default Textarea;
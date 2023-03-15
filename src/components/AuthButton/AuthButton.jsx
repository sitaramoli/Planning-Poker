import React from 'react'
import './AuthButton.scss'

const AuthButton = ({ text, onClick, type }) => {
    return (
        <button className="auth-button" type={type} onClick={onClick}>{text}</button>
    )
}

export default AuthButton;
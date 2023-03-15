import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthButton from '../../components/AuthButton/AuthButton';
import { UserContext } from '../../contexts/UserContext';

import './HomePage.scss';

const HomePage = () => {

    const navigate = useNavigate();
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        if (!window.localStorage.getItem("authenticated")) {
            navigate('/login');
        }
        else {
            const user = window.localStorage.getItem("user");
            setUser(JSON.parse(user));
        }
    }, []);

    const logout = () => {
        window.localStorage.removeItem("authenticated");
        navigate('/login');
    }

    return (
        <div className='home'>
            <div>
                ID: {user.id}<br />
                Name: {user.name}<br />
                Email: {user.email}<br />
            </div>
            <AuthButton text={'Log out'} type={'button'} onClick={logout} />
        </div>
    )
}

export default HomePage;
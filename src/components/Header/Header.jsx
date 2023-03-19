import React, { useState } from 'react';
import './Header.scss';

const Header = ({ title, children, user, handleLogout }) => {
    const avatar = user?.name ? user.name.charAt(0) : 'U';
    const [showDetails, setShowDetails] = useState(false);

    const onAvatarClick = () => {
        setShowDetails(!showDetails);
    }

    return (
        <div className='header'>
            <p className="header__title">{title}</p>
            <div className="header__actions">
                {children}
                <div className="header__actions__profile">
                    <div className="header__actions__profile__avatar" onClick={onAvatarClick}>
                        {avatar}
                    </div>
                    {showDetails && <ProfileDetails user={user} handleLogout={handleLogout} />}
                </div>
            </div>
        </div>
    )
}

export default Header;



const ProfileDetails = ({ user, handleLogout }) => {
    return (
        <div className="header__actions__profile__details">
            <p className="header__actions__profile__details__name">{user.name}</p>
            <p className="header__actions__profile__details__email">{user.email}</p>
            <button className='header__actions__profile__details__logout' onClick={handleLogout} ><i className="icon-logout"></i>Logout</button>
        </div>
    )
}

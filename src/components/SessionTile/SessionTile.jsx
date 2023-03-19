import React from 'react';
import './SessionTile.scss';

const SessionTile = ({ name, description, date, onClick }) => {
    return (
        <div className='sessionTile' onClick={onClick}>
            <div className="sessionTile__intro">
                <p className="sessionTile__intro__name">{name}</p>
                <p className="sessionTile__intro__description">{description}</p>
            </div>
            <p className="sessionTile__date">{date}</p>
        </div>
    )
}

export default SessionTile;
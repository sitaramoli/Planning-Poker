import './Card.scss';
import React from 'react'

const Card = ({ value, selected, onClick }) => {
    let className = '';
    switch (value) {
        case '0':
            className = 'card--white';
            break;
        case '1':
            className = 'card--blue';
            break;
        case '2':
            className = 'card--blue';
            break;
        case '3':
            className = 'card--blue';
            break;
        case '5':
            className = 'card--green';
            break;
        case '8':
            className = 'card--green';
            break;
        case '13':
            className = 'card--green';
            break;
        case '20':
            className = 'card--yellow';
            break;
        case '40':
            className = 'card--yellow';
            break;
        case '100':
            className = 'card--yellow';
            break;
        case '?':
            className = 'card--pink';
            break;
        default:
            className = '';
    }
    return (
        <div onClick={onClick} className={`card ${className} ${selected ? 'card--active' : ''}`} id={value} >{value}</div>
    )
}

export default Card;
import React from 'react';
import './NoDataFound.scss';

const NoDataFound = ({ message }) => {
    return (
        <div className='noDataFound'>{message}</div>
    )
}

export default NoDataFound
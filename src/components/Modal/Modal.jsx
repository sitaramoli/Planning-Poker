import './Modal.scss';

import React from 'react'

const Modal = ({ handleClose, show, children }) => {
    if (!show) return null;
    document.body.style.overflow = 'hidden';
    return (
        <div className='modal'>
            <section className="modal__main">
                <button className="modal__close-button" onClick={handleClose}>×</button>
                {children}
            </section>
        </div>
    );
}

export default Modal;
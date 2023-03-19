import React from 'react'
import Modal from '../Modal/Modal';
import './ExitDialog.scss';

const ExitDialog = ({ onClose, onExit, showDialog = false }) => {
    return (
        <>
            <Modal handleClose={onClose} show={showDialog}>
                <div className="exitDialog">
                    <p className="exitDialog__title">Warning!</p>
                    <p className="exitDialog__message">Are you sure you want to exit this page?</p>
                    <div className="exitDialog__message__actionContainer">
                        <button className="button button--reject" onClick={onExit} >Exit</button>
                        <button className="button button--accept" onClick={onClose} >Cancel</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ExitDialog;
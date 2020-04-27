import React from 'react';
import classes from './EditModal.module.scss';
import Backdrop from '../Backdrop/Backdrop';

type VocabularyEditModalProps = {
    show: boolean;
    modalClosed: () => void;
    children: JSX.Element | JSX.Element[] | null;
};

const VocabularyEditModal = ({show, modalClosed, children}: VocabularyEditModalProps): JSX.Element => {
    return (<>
            <Backdrop show={show} onClick={modalClosed}/>
            <div
                className={classes.Modal}
                style={{
                    transform: show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: show ? '1' : '0'
                }}
            >
                {children}
            </div>
        </>
    );
};

export default VocabularyEditModal;

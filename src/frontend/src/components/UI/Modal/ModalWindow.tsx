import React from 'react';
import Backdrop from "../Backdrop/Backdrop";
import classes from "./EditModal.module.scss";

export type ModalWindowProps = {
    show: boolean;
    modalClosed: () => void;
    children?: JSX.Element | JSX.Element[] | null;
};

const ModalWindow = ({show, modalClosed, children}: ModalWindowProps): JSX.Element => {
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

export default ModalWindow;

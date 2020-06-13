import React from 'react';
import Backdrop from "../backdrop/Backdrop";
import classes from "./Modal.module.scss";

export type ModalWindowProps = {
    modalClosed: () => void;
    children?: JSX.Element | JSX.Element[] | null;
};

const ModalWindow = ({modalClosed, children}: ModalWindowProps): JSX.Element => {
    return (<>
            <Backdrop onClick={modalClosed}/>
            <div
                className={classes.Modal}
            >
                {children}
            </div>
        </>
    );
};

export default ModalWindow;

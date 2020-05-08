import React from "react";
import {toast} from "react-toastify";

export const errorToast = (title: string, message: string): void => {
    toast.error(<><h3 style={{margin: 0}}>{title}</h3><p style={{margin: 0}}>{message}</p></>, {autoClose: false});
};

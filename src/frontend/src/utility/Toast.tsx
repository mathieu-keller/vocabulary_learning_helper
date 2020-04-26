import React from "react";
import {toast} from "react-toastify";

export const errorToast = (title: string, errorText: string): void => {
    toast.error(<><h3 style={{margin:0}}>{title}</h3>
        <p style={{margin:0}}>{errorText}</p></>, {
        position: "top-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
    });
}

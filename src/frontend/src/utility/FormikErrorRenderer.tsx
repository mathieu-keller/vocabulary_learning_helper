import React from "react";

export const ErrorRenderer = (msg: string): JSX.Element => <p style={{color: 'red', margin: 0}}>{msg}</p>;
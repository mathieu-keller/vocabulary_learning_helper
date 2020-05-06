import React, {useState} from 'react';
import Login from "../../components/Login/Login";
import {post} from "../../utility/restCaller";

const LoginView = (): JSX.Element => {
    const [loginData, setLoginData] = useState({userName: "", password: ""});
    const onChange = (field: 'userName' | 'password', value: string): void => {
        const data = {...loginData};
        data[field] = value;
        setLoginData(data);
    };

    const onSubmit = (): void => {
        post<{ userName: string; password: string }, {
            token: string;
            userName: string;
        }>('/login', loginData, (user) => {
            const d = new Date();
            d.setTime(d.getTime() + (30 * 60 * 1000));//30 minutes
            document.cookie = "token="+user.token + ";expires=" + d.toUTCString();
        }, 200);
    };

    return (
        <Login onSubmit={onSubmit} onChange={onChange} loginData={loginData}/>
    );
};

export default LoginView;

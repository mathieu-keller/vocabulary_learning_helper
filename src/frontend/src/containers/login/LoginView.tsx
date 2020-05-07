import React, {useState} from 'react';
import Login from "../../components/login/Login";
import {post} from "../../utility/restCaller";
import {useStore} from "../../store/store";
import {RouteComponentProps} from "react-router-dom";

const LoginView = (props: RouteComponentProps): JSX.Element => {
    const [loginData, setLoginData] = useState({userName: "", password: ""});
    const dispatch = useStore(false)[1];
    const onChange = (field: 'userName' | 'password', value: string): void => {
        const data = {...loginData};
        data[field] = value;
        setLoginData(data);
    };

    const onSubmit = (): void => {
        post<{ userName: string; password: string }, {}>('/login', loginData, () => {
            props.history.push("/");
            dispatch('LOGIN');
        }, 200);
    };

    return (
        <Login onSubmit={onSubmit} onChange={onChange} loginData={loginData}/>
    );
};

export default LoginView;

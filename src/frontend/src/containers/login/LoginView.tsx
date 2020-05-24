import React, {useState} from 'react';
import Login from "../../components/login/Login";
import {post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userActionFunctions} from "../../actions/user";

const LoginView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Login';
    const [loginData, setLoginData] = useState({userName: "", password: ""});
    const dispatch = useDispatch();
    const onChange = (field: 'userName' | 'password', value: string): void => {
        const data = {...loginData};
        data[field] = value;
        setLoginData(data);
    };

    const onSubmit = (): void => {
        post<{ userName: string; password: string }, { login: boolean }>('/login', loginData, (r) => {
            if (r.login) {
                props.history.push("/");
                dispatch(userActionFunctions.login());
            }
        }, 200);
    };

    return (
        <Login onSubmit={onSubmit} onChange={onChange} loginData={loginData}/>
    );
};

export default LoginView;

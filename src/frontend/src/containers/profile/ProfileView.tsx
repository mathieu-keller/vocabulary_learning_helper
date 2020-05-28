import React from 'react';
import Profile from "../../components/profile/Profile";
import {post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch} from "react-redux";
import {userActionFunctions} from "../../actions/user";

const ProfileView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Profile';
    const dispatch = useDispatch();
    const logoutHandler = (): void => {
        post<null, { login: boolean }>('/logout', null, (r) => {
            if (!r.login) {
                props.history.push('/');
                dispatch(userActionFunctions.logout());
            }
        }, 200);
    };

    return (
        <Profile logoutHandler={logoutHandler}/>
    );
};

export default ProfileView;

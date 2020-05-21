import React from 'react';
import Profile from "../../components/profile/Profile";
import {post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";
import {useDispatch} from "react-redux";
import * as userActions from "../../actions/user";
const ProfileView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Profile';
    const dispatch = useDispatch();
    const logoutHandler = (): void => {
        post<{}, { logout: boolean }>('/logout', null, (r) => {
            if (r.logout) {
                props.history.push('/');
                dispatch(userActions.logout());
            }
        }, 200);
    };

    return (
        <Profile logoutHandler={logoutHandler}/>
    );
};

export default ProfileView;

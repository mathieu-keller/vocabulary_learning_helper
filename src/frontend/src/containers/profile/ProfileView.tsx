import React from 'react';
import Profile from "../../components/profile/Profile";
import {useStore} from "../../store/store";
import {post} from "../../utility/restCaller";
import {RouteComponentProps} from "react-router-dom";

const ProfileView = (props: RouteComponentProps): JSX.Element => {
    document.title = 'Trainer - Profile';
    const dispatch = useStore(false)[1];
    const logoutHandler = (): void => {
        post<{}, { logout: boolean }>('/logout', null, (r) => {
            if (r.logout) {
                props.history.push('/');
                dispatch('LOGOUT');
            }
        }, 200);
    };

    return (
        <Profile logoutHandler={logoutHandler}/>
    );
};

export default ProfileView;

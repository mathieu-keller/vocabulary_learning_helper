import React, {lazy, useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import '../public/App.scss';
import {get} from "./utility/restCaller";
import {useStore} from "./store/store";
import {ToastContainer} from "react-toastify";
import NavigationBar from './components/navigation/navigationBar/NavigationBar';
import Home from './components/Home';
import ProtectedRoute from "./components/navigation/route/ProtectedRoute";

const VocabularyView = lazy(() => import('./containers/vocabulary/VocabularyView'));
const LoginView = lazy(() => import('./containers/login/LoginView'));
const ProfileView = lazy(() => import('./containers/profile/ProfileView'));
const App = (): JSX.Element => {
    const [store, dispatch] = useStore();
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
        get<{ login: boolean }>('/check-login', (r) => {
            if (r.login) {
                dispatch('LOGIN');
            }
        });
    }, []);
    useEffect(() => {
        if (store.user?.isLogin) {
            setTimer(setInterval(() => get<{}>('/refresh-token'), 900000));//15 minutes
        } else if (timer) {
            clearInterval(timer);
        }
    }, [store.user?.isLogin]);
    return (
        <>
            <ToastContainer/>
            <NavigationBar/>
            <Switch>
                <ProtectedRoute path='/profile' isAllowed={store.user?.isLogin}
                                render={(props) => <ProfileView {...props}/>}/>
                <ProtectedRoute path='/vocabulary' isAllowed={store.user?.isLogin} render={() => <VocabularyView/>}/>
                <ProtectedRoute path='/login' isAllowed={!store.user?.isLogin}
                                render={(props) => <LoginView {...props}/>}/>
                <Route path='/' component={Home} exact/>
            </Switch>
        </>);
};
export default App;

import React, {lazy, Suspense, useEffect, useState} from 'react';
import {Route, Switch} from 'react-router-dom';
import '../public/App.scss';
import {Skeleton} from "@material-ui/lab";
import {get} from "./utility/restCaller";
import {useStore} from "./store/store";
import {ToastContainer} from "react-toastify";
import NavigationBar from './components/navigation/NavigationBar';
import Home from './components/Home';

const VocabularyView = lazy(() => import('./containers/vocabulary/VocabularyView'));
const LoginView = lazy(() => import('./containers/login/LoginView'));
const ProfileView = lazy(() => import('./containers/profile/ProfileView'));
const App = (): JSX.Element => {
    const headerHeight = 64;
    const [store, dispatch] = useStore();
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    useEffect(() => {
        get<{}>('/refresh-token', () => {
            dispatch('LOGIN');
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
                <Route path='/profile'
                       render={(props) =>
                           <Suspense fallback={
                               <Skeleton variant="rect" height={window.innerHeight - headerHeight} animation="wave"/>
                           }>
                               <ProfileView {...props}/>
                           </Suspense>}
                       exact/>
                <Route path='/vocabulary'
                       render={() =>
                           <Suspense fallback={
                               <Skeleton variant="rect" height={window.innerHeight - headerHeight} animation="wave"/>
                           }>
                               <VocabularyView/>
                           </Suspense>}
                       exact/>
                <Route path='/login'
                       render={(props) =>
                           <Suspense fallback={
                               <Skeleton variant="rect" height={window.innerHeight - headerHeight} animation="wave"/>
                           }>
                               <LoginView {...props}/>
                           </Suspense>}
                       exact/>
                <Route path='/' component={Home} exact/>
            </Switch>
        </>);
};
export default App;

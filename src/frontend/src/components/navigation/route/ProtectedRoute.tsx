import React, {Suspense} from 'react';
import {Skeleton} from "@material-ui/lab";
import {Route} from "react-router-dom";
import {RouteComponentProps} from "react-router";

type ProtectedRouteType = {
    path: string;
    render: (props: RouteComponentProps<any>) => React.ReactNode;
    isAllowed?: boolean;
}

const ProtectedRoute = (props: ProtectedRouteType): JSX.Element | null => {
    let route = null;
    if (props.isAllowed) {
        route = (<Route path={props.path}
                        render={(r) =>
                            <Suspense fallback={
                                <Skeleton variant="rect" height={window.innerHeight} animation="wave"/>
                            }>
                                {props.render(r)}
                            </Suspense>}
                        exact/>);
    }
    return route;
};

export default ProtectedRoute;

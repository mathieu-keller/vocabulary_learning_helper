import React, {useEffect, useState} from 'react';
import {UserStore} from "./configureUserStore";

export type Store = {
    user?: UserStore;
}
let globalState: Store = {};
let listeners: React.Dispatch<React.SetStateAction<Store>>[] = [];
let actions: { [key: string]: any } = {};

type returnType = [Store, (actionIdentifier: string, payload: any) => void] ;


export const useStore = (shouldListen = true): returnType => {
    const setState = useState(globalState)[1];

    const dispatch = (actionIdentifier: string, payload: any): void => {
        const newState = actions[actionIdentifier](globalState, payload);
        globalState = {...globalState, ...newState};

        for (const listener of listeners) {
            listener(globalState);
        }
    };

    useEffect(() => {
        if (shouldListen) {
            listeners.push(setState);
        }

        return () => {
            if (shouldListen) {
                listeners = listeners.filter(li => li !== setState);
            }
        };
    }, [setState, shouldListen]);

    return [globalState, dispatch];
};

export const initStore = (userActions: any, initialState: Store): void => {
    if (initialState) {
        globalState = {...globalState, ...initialState};
    }
    actions = {...actions, ...userActions};
};

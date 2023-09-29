import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
    AuthorizationStatus 
} from './AuthorizationTypes';

export const defaultAuthorizationStatus = (): AuthorizationStatus => ({
    status: 'unauthorized',
    username: '',
    data: null
});
export const useAuthorization = () => useContext(AuthorizationContext);
export const AuthorizationContext = createContext<AuthorizationStatus>(defaultAuthorizationStatus());

/**
 * Executes initial authorization attempts and handles 
 * distributing the authorization status to the rest 
 * of the application through the AuthorizationContext.
 * @param props 
 * @returns 
 */
export default function Authorization(props: any): JSX.Element {
    const [status, setStatus] = useState<AuthorizationStatus>(defaultAuthorizationStatus());

    useEffect(() => {
        console.log('Staffanshopper.grossconfig (Extended window object working)', Staffanshopper.grossconfig);
    }, []);

    return (
        <AuthorizationContext.Provider value={status}>
            {props.children}
        </AuthorizationContext.Provider>
    )
} 
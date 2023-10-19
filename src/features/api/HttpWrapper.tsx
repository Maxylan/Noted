import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import useApiModule from './api';
import { 
    ApiProps, AuthorizationStatus,
    Product
} from '../../types/api';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export const Api = createContext({});
export const AuthorizationContext = createContext<AuthorizationStatus>({
    health: 'unhealthy',
    status: 'unauthorized',
    username: '',
    data: null
});
export const useAuthorization = () => useContext(AuthorizationContext);
export const useApi = () => useContext(Api);

/**
 * Executes initial authorization attempts and handles 
 * distributing the authorization status and API instance
 * to the rest of the application.
 * @param props 
 * @returns 
 */
export default function HttpWrapper(props: any): JSX.Element {
    const [status, setStatus] = useState<AuthorizationStatus>({
        health: 'unknown',
        status: 'unauthorized',
        username: '',
        data: null
    });

    const {api, isLoading, products} = useApiModule();

    useEffect(() => {
        console.log('Staffanshopper.grossconfig (Extended window object working)', Staffanshopper.grossconfig);

        if (!status.data || status.health === 'unknown') {
            // Get the Staffanstorp store. This'll also ensure that the API is healthy. Two birds one stone baby.
            try {
                status.data = api.stores();
                status.health = 'healthy';
            }
            catch (e) {
                status.health = 'unhealthy';
            }

        }

        if (!products.length) {
            // Load from localstorage.

            // Still no products? Load *some* topsellers from API.
            // api.topsellers();
        }
    }, []);

    return (
        <AuthorizationContext.Provider value={status}>
            {(status.health === 'unknown' && isLoading) ? (
                <div className={['flex', 'flex-row', 'text-center', 'items-center'].join(' ')}>
                    <div className='flex-auto text-lg'><img src='/loader.svg' alt='Loading..'/></div>
                </div>
            ) : (
                <Api.Provider value={api}>
                    {props.children}
                </Api.Provider>
            )}
        </AuthorizationContext.Provider>
    )
} 
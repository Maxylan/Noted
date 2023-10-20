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

    const {api, isLoading, setStore, products} = useApiModule();

    useEffect(() => {
        console.log('Staffanshopper.grossconfig (Extended window object working)', Staffanshopper.grossconfig);

        if (!status.data || status.health === 'unknown') {
            // Get the Staffanstorp store. This'll also ensure that the API is healthy. Two birds one stone baby.
            try {
                api.stores('Staffanstorp').then((res: any) => {
                    status.health = (res.status === 'success' || res.status < 300) && res.data ? 'healthy' : 'unhealthy';
                    status.data = res.data;
                    if (status.health === 'healthy') {
                        setStore(status.data.id);
                    }
                    // console.log('res', res);
                });
            }
            catch (e) {
                status.health = 'unhealthy';
            }

        }

        if (!products.length) {
            // Load from localstorage.
            let _products = JSON.parse(localStorage.getItem('staffanshopper_products') ?? '[]');

            // Still no products? Load *some* topsellers from API.
            if (!_products.length) {
                let res = api.topsellers();
            }
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
                    <span className={['Status', 'absolute', 'top-0', 'left-0', 'text-[rgba(128,128,128,0.75)]', 'text-sm', 'select-none', 'z-10'].join(' ')}>
                        <pre>
                            {isLoading ? '🟡' : (status.health === 'healthy' ? '🟢' : '🔴')}
                            {(status.health === 'healthy' && window.innerWidth >= 768) && (
                                <a href={`${Staffanshopper.grossconfig.HOST}${status.data.url}`}>{` (${status.data.id}) ${status.data.address.city}`}</a>
                            )}
                        </pre>
                    </span>
                    {props.children}
                </Api.Provider>
            )}
        </AuthorizationContext.Provider>
    )
} 
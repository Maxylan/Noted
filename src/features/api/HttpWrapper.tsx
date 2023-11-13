import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import useApiModule from './api';
import Settings from '../settings';
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
    provider: null,
    store: null
});
export const useAuthorization = () => useContext(AuthorizationContext);
export const useApi = () => useContext(Api);

export const useDebounce = (func: (...args: any) => any, delay: number) => {
    const [debounceResults, setDebounceResults] = useState<any>();
    const [debounceLoading, setDebounceLoading] = useState<boolean>(false);
    const debounceTimer = useRef<any>();
    return [
        debounceResults,
        debounceLoading,
        (...args: any) => {
            clearTimeout(debounceTimer.current);
            setDebounceLoading(true);
            debounceTimer.current = setTimeout(() => { func(...args).then((r: any) => { console.log('debounceResults', r); setDebounceResults(r);}).finally(() => setDebounceLoading(false)); }, delay);
        }
    ];
}

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
        provider: null,
        store: null
    });

    const {api, isLoading, setStore, products, setProducts} = useApiModule();

    useEffect(() => {
        // console.log('Noted.grossconfig (Extended window object working)', Noted.grossconfig);

        if (!status.provider || status.health === 'unknown') {
            // Get the Staffanstorp store provider. This'll also ensure that the API is healthy. Two birds one stone baby.
            try {
                api.provider().then((res: any) => {
                    // Determine API Health by result of this request.
                    status.health = (res.status === 'success' || res.status < 300) && res.data ? 'healthy' : 'unhealthy';

                    // Set provider on success.
                    status.provider = res.data;

                    console.log('res', res);
                });
            }
            catch (e) {
                status.health = 'unhealthy';
            }

        }

        // Get the Staffanstorp store!
        if (!status.store) {
            api.stores(Settings.city()).then((res: any) => {
                // Determine API Health by result of this request.
                // console.log('res', res);

                if ((res.status === 'success' || res.status < 300) && res.data) {
                    // status.health === 'healthy'
                    // Set storedata as status.data and its ID.
                    setStatus(s => ({...s, health: 'healthy', store: res?.data, id: res?.data?.id}));
                    setStore(status.store.id);
                }
                else {
                    setStatus(s => ({...s, health: 'unhealthy'}));
                }
            });
        }

        if (!products.length) {
            // Load from localstorage.
            let _products = JSON.parse(localStorage.getItem('noted_products') ?? '[]');

            // Still no products? Load *some* topsellers from API.
            if (!_products.length) {
                api.topsellers().then((res: any) => {
                    // Determine API Health by result of this request.
                    // console.log('res', res);
                    
                    if ((res.status === 'success' || res.status < 300) && res.data) {
                        // status.health === 'healthy'
                        // Update localStorage on success.
                        setStatus(s => ({...s, health: 'healthy'}));
                        localStorage.setItem('noted_products', JSON.stringify(res.data));
                    }
                    else {
                        setStatus(s => ({...s, health: 'unhealthy'}));
                    }
                });
            }
            else {
                // Set the products.
                setProducts(_products);
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
                    <span className={['Status', 'fixed', 'top-0', 'left-0', 'text-[rgba(128,128,128,0.75)]', 'text-sm', 'select-none', 'z-10'].join(' ')}>
                        <pre>
                            {isLoading ? '🟡' : (status.health === 'healthy' ? '🟢' : '🔴')}
                            {(status.health === 'healthy' && status.store && status.store.url && window.innerWidth >= 768) && (
                                <a href={`${app.grossconfig?.HOST}${status.store.url}`} target='_blank' rel='noreferrer'>{` (${status.store.id}/${status.provider.storeNumber}) ${status.store.address.city}`}</a>
                            )}
                        </pre>
                    </span>
                    {props.children}
                </Api.Provider>
            )}
        </AuthorizationContext.Provider>
    )
} 
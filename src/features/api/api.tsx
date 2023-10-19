import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { 
    ApiProps, Endpoint, StdResponse, Product
} from '../../types/api';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 * 
 * I don't claim any ownership/copyright over the actual 
 * publically-available CityGross API.
 */


const useApiModule = (): ApiProps => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [store, setStore] = useState<number>(0);

    return {
        api: {
            /**
             * 
             * @returns 
             */
            stores: async () => {
                setIsLoading(true);

                let stores = await fetch(
                    `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/PageData/stores`
                ).then(
                    (r) => r.json()
                ).catch(
                    // Handle errors, like not being able to reach the host.
                    (error) => {
                        // I guess just log it for now, I'll figure something out later.
                        console.error(error);
                    }
                );

                // console.log('result', stores);
                let staffanstorp = stores.find((s: any) => s.data.address.city === 'Staffanstorp');

                setIsLoading(false);
                console.log('Store', staffanstorp);
                return staffanstorp.data;
            },
            /**
             * 
             * @returns 
             */
            topsellers: async () => {
                setIsLoading(true);

                let result = await fetch(
                    `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/esales/topsellers?page=0&size=33`
                ).then(
                    (r) => r.json()
                ).catch(
                    // Handle errors, like not being able to reach the host.
                    (error) => {
                        
                    }
                );

                setIsLoading(false);
                return result;
            },
            /**
             * 
             * @returns 
             */
            search: async (query: string, mode: 'normal'|'quick', page: number = 0) => {
                setIsLoading(true);
                let url = `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/esales/search`;
                switch(mode) {
                    case 'normal':
                        url += `/?Q=${query}&page=${page}&store=${store}`;
                        break;
                    case 'quick':
                        url += `/?q=${query}&store=${store}`;
                        break;
                }

                let results = await fetch(
                    url
                ).then(
                    (r) => r.json()
                ).catch(
                    // Handle errors, like not being able to reach the host.
                    (error) => {
                        
                    }
                );

                setIsLoading(false);
                console.log('Search-result', results);
                return results;
            },
        },
        isLoading: isLoading,
        setStore: setStore,
        products: products
    }
};

export default useApiModule;
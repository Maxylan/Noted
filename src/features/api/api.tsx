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

const convertToProduct = (product: any): Product => {

    return product;
};

const useApiModule = (): ApiProps => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [store, setStore] = useState<number>(0);

    return {
        api: {
            /**
             * Makes a request to get all stores from the API.
             * Always caches the result in sessionStorage.
             * 
             * Pass `storeToFind` to pluck a specific store from the array.
             * 
             * @returns StdResponse<any>
             */
            stores: async (storeToFind: string|undefined = undefined): Promise<StdResponse<any>> => {
                setIsLoading(true);
                let response, apiResponse;
                let data = sessionStorage.getItem('staffanshopper_stores');
                data = data ? JSON.parse(data) : null;
                
                if (data) {
                    // Construct the stdResponse object from cached data
                    apiResponse = {
                        status: 'success',
                        message: `${(data ? 'success' : 'error')}` + (data ? ': cached' : ''),
                        data: data
                    };
                }
                else {
                    // Make the fetch.
                    response = await fetch(
                        `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/PageData/stores`
                    ).catch(
                        // Handle errors, like not being able to reach the host.
                        // I guess just log it for now, I'll figure something out later.
                        (error) => {
                            console.error(error);
                            return error;
                        }
                    );

                    data = await response.json();
                    sessionStorage.setItem('staffanshopper_stores', JSON.stringify(data));

                    // Construct the stdResponse object
                    apiResponse = {
                        status: response.status,
                        message: `${(response.status < 400? 'success' : 'error')}` + (response.statusText ? `: ${response.statusText}` : ''),
                        data: data
                    };
                }

                // Special operations.
                if (storeToFind && Array.isArray(apiResponse.data)) {
                    apiResponse.data = (apiResponse.data as any[]).find((s: any) => s.data.address.city === storeToFind)?.data;
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                return apiResponse;
            },

            /**
             * 
             * @returns 
             */
            topsellers: async (): Promise<StdResponse<any>> => {
                // Make the fetch.
                setIsLoading(true);
                let response = await fetch(
                    `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/esales/topsellers?page=0&size=33`
                ).catch(
                    // Handle errors, like not being able to reach the host.
                    // I guess just log it for now, I'll figure something out later.
                    (error) => {
                        console.error(error);
                        return error;
                    }
                );

                // Construct the stdResponse object
                let apiResponse = {
                    status: response.status,
                    message: `${(response.status < 400? 'success' : 'error')}` + (response.statusText ? `: ${response.statusText}` : ''),
                    data: await response.json()
                };

                // Special operations.
                if (Array.isArray(apiResponse.data)) {
                    apiResponse.data = apiResponse.data.map(convertToProduct);
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                return apiResponse;
            },

            /**
             * 
             * @returns 
             */
            search: async (query: string, mode: 'normal'|'quick', page: number = 0): Promise<StdResponse<any>> => {
                setIsLoading(true);
                // Construct URL
                let url = `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/esales/search`;
                switch(mode) {
                    case 'normal':
                        url += `/?Q=${query}&page=${page}&store=${store}`;
                        break;
                    case 'quick':
                        url += `/?q=${query}&store=${store}`;
                        break;
                }

                // Make the fetch.
                let response = await fetch(
                    url
                ).catch(
                    // Handle errors, like not being able to reach the host.
                    // I guess just log it for now, I'll figure something out later.
                    (error) => {
                        console.error(error);
                        return error;
                    }
                );

                // Construct the stdResponse object
                let apiResponse = {
                    status: response.status,
                    message: `${(response.status < 400? 'success' : 'error')}` + (response.statusText ? `: ${response.statusText}` : ''),
                    data: await response.json()
                };

                // Special operations.
                if (Array.isArray(apiResponse.data)) {
                    apiResponse.data = apiResponse.data.map(convertToProduct);
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                return apiResponse;
            },
        },
        isLoading: isLoading,
        setStore: setStore,
        products: products
    }
};

export default useApiModule;
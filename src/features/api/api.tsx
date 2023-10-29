import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { 
    ApiProps, Endpoint, StdResponse, Product, Price
} from '../../types/api';
import {
    date
} from '../../utils/helpers';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 * 
 * I don't claim any ownership/copyright over the actual 
 * publically-available CityGross API.
 */

const parsePriceFromPrices = (prices: any, store: number): Price => {
    let price = null, highestOrdinaryCost = 0;
    if (!prices) {
        console.warn('No prices found?', prices);
    }
    for(let i = 0; i < prices.length; i++) 
    {
        if (prices[i].storeNumber === store) {
            price = prices[i];
            break;
        } 
        else if (prices[i].ordinaryPrice.price > highestOrdinaryCost) {
            price = prices[i];
            // Don't break! Keep checking.
        }
    }

    let promotions = [...price.promotions, ...price.promotions2].filter((promo: any) => {
        // promo.from (ISO DateTime stamp) must be > now and promo.to (ISO DateTime stamp) must be < now
        return new Date(promo.from) > new Date() && new Date(promo.to) < new Date();
    });
    if (promotions.length > 0) {
        console.log('Promos found!', promotions);
    }

    return {
        /** Current price (Note: Check "updated" to see when "current" was set) */
        current: price.currentPrice.price,
        /** Ordinary price */
        ordinary: price.ordinaryPrice.price,
        /** Ordinary price */
        unit: price.ordinaryPrice.unit,
        /** DateTime when price was set. */
        updated: date(),
        /** Is there currently* a promotion? (*Note: Check "updated" to see when the promotion may have been) */
        promotion: promotions.length ? {
            from: promotions[0].from,
            to: promotions[0].to,
            minAmount: promotions[0].minAmount ?? undefined,
            minQuantity: promotions[0].minQuantity ?? undefined,
            value: promotions[0].value,
            price: promotions[0].priceDetails.price,
        } : undefined
    };
}
const convertToProduct = (product: any, store: number): Product => ({
    name: product.name,
    brand: product.brand,
    url: product.url,
    id: product.id,
    category: {
        category: product.category,
        super: product.superCategory,
        bf: product.bfCategory,
    },
    cover: {
        url: product.images[0]?.url,
        alt: product.images[0]?.alt,
    },
    images: product.images.map((i: any) => ({
        url: i?.url,
        alt: i?.alt,
    })),
    /** `.tags` Can contain a tag with `.name` = "LAGT_PRIS" **or** `.namespace` = "LÄGRE_PRIS" */
    lowPrice: product.tags?.some((tag: any) => tag?.namespace === 'LÄGRE_PRIS' || tag?.name === 'LAGT_PRIS'),
    /** Price details */
    price: parsePriceFromPrices(product.prices, store)
});

const useApiModule = (): ApiProps => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [provider, setProvider] = useState<number>(0);
    const [store, setStore] = useState<number>(0);

    return {
        api: {
            /**
             * Makes a request to get your recommended provider from the API.
             * Always caches the result in sessionStorage.
             * 
             * @returns StdResponse<any>
             */
            provider: async (): Promise<StdResponse<any>> => {
                setIsLoading(true);
                let response, apiResponse;
                let data = sessionStorage.getItem('staffanshopper_provider');
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
                        `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/sites/11/storeNumber`
                    ).catch(
                        // Handle errors, like not being able to reach the host.
                        // I guess just log it for now, I'll figure something out later.
                        (error) => {
                            console.error(error);
                            return error;
                        }
                    );

                    data = await response.json();
                    sessionStorage.setItem('staffanshopper_provider', JSON.stringify(data));

                    // Construct the stdResponse object
                    apiResponse = {
                        status: response.status,
                        message: `${(response.status < 400? 'success' : 'error')}` + (response.statusText ? `: ${response.statusText}` : ''),
                        data: data
                    };
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                setProvider((apiResponse!.data as any)?.storeNumber)
                return apiResponse;
            },

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
                if (Array.isArray(apiResponse.data.data)) {
                    apiResponse.data = apiResponse.data.data.map(convertToProduct);
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                return apiResponse;
            },

            /**
             * 
             * @returns 
             */
            search: async (query: string, mode: 'normal'|'quick', page: number = 0, use: 'store'|'provider' = 'provider'): Promise<StdResponse<any>> => {
                setIsLoading(true);
                // Construct URL
                let url = `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.BASE_URL}/esales/search`;
                switch(mode) {
                    case 'normal':
                        url += `/?Q=${query}&page=${page}&type=product&store=${use === 'store' ? store : provider}`;
                        break;
                    case 'quick':
                        url += `/?q=${query}&type=product&store=${use === 'store' ? store : provider}`;
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
                if (Array.isArray(apiResponse.data.data)) {
                    apiResponse.data = apiResponse.data.data.map(convertToProduct);
                }

                // Set loading back to false and return the stdResponse object
                setIsLoading(false);
                return apiResponse;
            },
        },
        isLoading: isLoading,
        store: store,
        setStore: setStore,
        products: products,
        setProducts: setProducts,
    }
};

export default useApiModule;
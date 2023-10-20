/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface AuthorizationStatus {
    /** Is host reachable? */
    health: 'healthy' | 'unhealthy' | 'unknown';
    /** Logged-in / Not Logged-in */
    status: 'unauthorized' | 'authorized';
    /** Username */
    username: string;
    /** TODO! Auth-data */
    data: any // TODO: Define type.
}

export interface ApiProps {
    api: {
        [key: string]: any /* I don't know how to define variable amount of arguments! :D ({...args}) => Promise<StdResponse<any>> */;
    },
    isLoading: boolean,
    setStore: React.Dispatch<React.SetStateAction<number>>,
    products: Product[],
};

export interface StdResponse<T> {
    status: number | 'success' | 'error';
    message: string;
    data: T|undefined;
}

/**
 * Most commonly fetched through the API, so deserving of its own type.
 */
export interface Product {
    name: string;
    brand: string;
    url: string;
    category: {
        category: string;
        super: string;
        bf: string;
    };
    image: {
        url: string;
        alt: string;
    };
    /** `.tags` Can contain a tag with `.name` = "LAGT_PRIS" **or** `.namespace` = "LÄGRE_PRIS" */
    lowPrice: boolean;
    /** Price details */
    price: {
        /** Current price (Note: Check "updated" to see when "current" was set) */
        current: number,
        /** Ordinary price */
        ordinary: number,
        /** DateTime when price was set. */
        updated: string,
        /** Is there currently* a promotion? (*Note: Check "updated" to see when the promotion may have been) */
        promotion: undefined|{
            from: string,
            to: string,
            minAmount: number|undefined,
            minQuantity: number|undefined,
            value: number,
            price: number,
        }
    }
}

export type Endpoint<T> = ([...arg]) => Promise<StdResponse<T>>;
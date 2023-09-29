/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface AuthorizationStatus {
    status: 'unauthorized' | 'authorized';
    username: string;
    data: any // TODO: Define type.
}
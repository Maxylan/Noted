export interface AuthorizationStatus {
    status: 'unauthorized' | 'authorized';
    username: string;
    data: any // TODO: Define type.
}
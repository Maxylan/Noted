/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface GrossConfig {
    DEBUG: boolean,
    HOST: 'https://www.citygross.se',
    BASE_URL: string,
    CATERING_STORAGE_KEY: string,
    AUTH_STORAGE_KEY: string,
    STORAGE_TYPE: string,
    // Doubt these will be needed.
    VERSION: undefined,
    SERVICE_WORKER_ACTIVE: undefined,
    PICTURE_BASE_URL: undefined,
    RECAPTCHA_SITE_KEY: undefined,
    USE_RECAPTCHA: undefined,
}

export interface StaffansConfig {
    DEBUG: boolean,
    HOST: string,
    PORT: string
}
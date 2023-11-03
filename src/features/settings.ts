export default class Settings {
    private static updateSetting = (key: string, value: any): void => {
        localStorage.setItem(`noted_${key}`, JSON.stringify(value));
    }
    private static getSetting = (key: string): any => {
        let value = localStorage.getItem(`noted_${key}`);
        return value && JSON.parse(value);
    };

    public static debugEnabled = (set: boolean|undefined = undefined) => Settings.debug(set);
    public static debug = (set: boolean|undefined = undefined): boolean => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('debug', set);
        }
        return Settings.getSetting('debug') ?? false;
    }

    public static city = (set: string|undefined = undefined): string => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('city', set);
        }
        return Settings.getSetting('city') ?? 'Staffanstorp';
    }

    public static showImages = (set: boolean|undefined = undefined) => Settings.images(set);
    public static images = (set: boolean|undefined = undefined): boolean => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('images', set);
        }
        return Settings.getSetting('images') ?? false;
    }
}
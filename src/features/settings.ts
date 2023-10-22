export default class Settings {
    private static updateSetting = (key: string, value: any): void => {

    }
    private static getSetting = (key: string): any => {
        let value = localStorage.getItem(`staffanshopper_${key}`);
        return value && JSON.parse(value);
    };

    public static debugEnabled = () => Settings.debug();
    public static debug = (set: boolean|undefined = undefined): boolean => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('debug', set);
        }
        return Settings.getSetting('debug') ?? false;
    }

    public static showImages = (set: boolean|undefined = undefined) => Settings.images(set);
    public static images = (set: boolean|undefined = undefined): boolean => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('images', set);
        }
        return Settings.getSetting('images') ?? false;
    }
}
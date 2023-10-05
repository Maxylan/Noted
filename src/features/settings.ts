export default class Settings {
    private static updateSetting = (key: string, value: any): void => {

    }
    private static getSetting = (key: string): any => {

    }

    public static debugEnabled = () => this.debug();
    public static debug = (set: boolean|undefined = undefined): boolean => {
        if (typeof set !== 'undefined') {
            Settings.updateSetting('debug', set);
        }
        return Settings.getSetting('debug') ?? false;
    }
}
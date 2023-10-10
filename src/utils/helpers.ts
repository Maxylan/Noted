import { 
    Note, 
    Group, 
    Entry 
} from '../types/Notes';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


export const generateUUID = () => Date.now().toString(16) + Math.random().toString(16).substring(2, 10);

export const date = () => {
    let d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};
export const dateKey = () => {
    let d = new Date();
    return d.getFullYear() + '_' + (d.getMonth() + 1);
};
export const getMonthName = (month: number) => {
    switch (month) {
        case 1: return 'January';
        case 2: return 'February';
        case 3: return 'March';
        case 4: return 'April';
        case 5: return 'May';
        case 6: return 'June';
        case 7: return 'July';
        case 8: return 'August';
        case 9: return 'September';
        case 10: return 'Oktober';
        case 11: return 'November';
        case 12: return 'December';
    }
};

export const isGroup = (e: Entry|Group): boolean => e && e.hasOwnProperty('entries');
export const hasGroups = (a: (Entry|Group)[]): boolean => a.some((e: Entry|Group) => isGroup(e));

export const reduceEntries = (entries: (Group|Entry)[]): number => {
    return entries.reduce((acc, entry) => {
        if (entry.hasOwnProperty('entries')) {
            return acc + reduceEntries((entry as Group).entries);
        }
        return acc + ((entry as Entry).price ?? 0);
    }, 0);
}
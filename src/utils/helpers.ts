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

export const isGroup = (e: Entry|Group): boolean => e.hasOwnProperty('entries');
export const hasGroups = (a: (Entry|Group)[]): boolean => a.some((e: Entry|Group) => isGroup(e));

export const reduceEntries = (entries: (Group|Entry)[]): number => {
    return entries.reduce((acc, entry) => {
        if (entry.hasOwnProperty('entries')) {
            return acc + reduceEntries((entry as Group).entries);
        }
        return acc + ((entry as Entry).price ?? 0);
    }, 0);
}
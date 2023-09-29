import { 
    Note, 
    Group, 
    Entry 
} from '../types/Notes';

export const generateUUID = () => Date.now().toString(16) + Math.random().toString(16).substring(2, 10);

export const reduceEntries = (entries: (Group|Entry)[]): number => {
    return entries.reduce((acc, entry) => {
        if (entry.hasOwnProperty('entries')) {
            return acc + reduceEntries((entry as Group).entries);
        }
        return acc + ((entry as Entry).price ?? 0);
    }, 0);
}
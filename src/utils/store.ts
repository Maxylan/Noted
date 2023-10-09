import { 
    Note, 
    Group, 
    Entry 
} from '../types/Notes';
import { date } from './helpers';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export enum LocalStorageKeys {
    Notes = 'staffanshopper_notes_', // date() from './helpers' needs to be appended.
    Settings = 'staffanshopper_settings'
}

// TODO: Refactor both saveNote and getNotes as they are unreadable right now.
export const saveNote = (note: Note): void => {
    if (note) {
        let month = getNotes(date());
        month[note.id] = note;
        if (month) {
            localStorage.setItem(LocalStorageKeys.Notes + date(), JSON.stringify(month));
        }
    }
};

export const getNotes = (utc: string = date()): {[key: string]: Note} => {
    let month: string|{[key: string]: Note} = (localStorage.getItem(LocalStorageKeys.Notes + date()) ?? '') as string;
    return (month ? JSON.parse(month) : {}) as {[key: string]: Note};
}
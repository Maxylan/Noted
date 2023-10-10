import { 
    Note, 
    Group, 
    Entry 
} from '../types/Notes';
import { date, dateKey } from './helpers';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export enum LocalStorageKeys {
    Notes = 'staffanshopper_notes_', // dateKey() from './helpers' needs to be appended.
    Settings = 'staffanshopper_settings'
}

// TODO: Refactor both saveNote and getNotes as they are unreadable and almost definetly horrible garbage piles on fire.
var currentKey = dateKey();
var notesCache: any = {};

/**
 * Retrieves a month's notes from local storage using a key of `YYYY_MM` (Current year + month).
 * @param   utc (Current year + month)
 * @returns {[key: string]: Note}
 */
export const getNotes = (utc: string = currentKey): {[key: string]: Note}|null => {
    let month: null|string|{[key: string]: Note}
    if (notesCache.hasOwnProperty(utc)) {
        month = notesCache[utc];
    }
    else {
        month = (localStorage.getItem(LocalStorageKeys.Notes + utc) ?? '') as string;
        month = (month ? JSON.parse(month) : null);
    }
    
    if (month && utc !== currentKey) { notesCache[utc] = month; }
    return month as {[key: string]: Note}|null;
}

/**
 * Save a note to the current month's local storage.
 * 
 * Also scans previous 11 months to determine if this note already existed and is being updated.
 * If it encounters this note in a previous month in localStorage, it'll delete the old entry.
 * 
 * @param   Note
 * @returns void
 */
export const saveNote = (note: Note): void => {
    if (note) {
        note.editable = false;
    }
    if (note && note.entries && note.entries.length > 0) {
        let month: {[key: string]: Note}|null = getNotes(currentKey) ?? {[note.id]: note};

        // Remove note from this month if it already exists.
        if (month[note.id]) {
            console.warn(`Removing ${note.id} from ${currentKey}...`);
            delete month[note.id];
        }

        // Store note in this month.
        month[note.id] = note;
        if (month) {
            localStorage.setItem(LocalStorageKeys.Notes + currentKey, JSON.stringify(month));
        }

        // Get notes from the previous 11 months as well, and delete any and all entries with the same id, if any.
        // year + month extrapolated from currentKey.
        let [y, m] = currentKey.split('_').map((n) => parseInt(n));
        for (let i = 1; i < 12; i++) {
            if (m - i < 1) { y -= 1; m = 12; }
            
            // New month-key constructed and used to get notes.
            month = getNotes(`${y}_${m - i}`);
            
            if (month) {
                // Remove this note from an old month if its present.
                if (month[note.id]) {
                    console.warn(`Removing ${note.id} from ${y}_${m - i}...`);
                    delete month[note.id];
                    localStorage.setItem(LocalStorageKeys.Notes + `${y}_${m - i}`, JSON.stringify(month));
                }

                // Update cache to avoid issues.
                if (notesCache.hasOwnProperty(`${y}_${m - i}`)) {
                    notesCache[`${y}_${m - i}`] = month;
                }
            }
        }
    }
};
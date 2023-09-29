import { generateUUID } from "../utils/helpers";

export const defaultNote = (): Note => ({
    id: generateUUID(),
    title: `${new Date().toLocaleDateString()} - New Note`,
    created: Date.now(),
    updated: Date.now(),
    editable: true,
    entries: [
        {
            title: 'Test Entry 1',
            checked: false,
        } as Entry,
        {
            title: 'Test Group 1',
            color: 'rgb(255, 197, 167)',
            entries: [
                {
                    title: 'Test Group Entry 1',
                    checked: false,
                    price: 4.99,
                } as Entry,
                {
                    title: 'Test Group Entry 2',
                    checked: true,
                    price: 8.49,
                } as Entry
            ],
        } as Group,
        {
            title: 'Test Entry 2',
            checked: true,
            price: 10.99,
        } as Entry,
    ]
});

export interface Note {
    /**
     * Note unique identifier.
     */
    id: string;
    /**
     * Note name.
     */
    title: string;
    /**
     * Unix timestamp `Date.now()`
     */
    created: number;
    /**
     * Unix timestamp `Date.now()`
     */
    updated: number;
    /**
     * Is editable? / Display buttons that allow the user to edit the note.
     */
    editable: boolean;
    /**
     * All entires in the note.
     * Each entry represents a row in the note.
     */
    entries: (Entry|Group)[];
}

export interface Group {
    /**
     * Group name.
     */
    title: string;
    /**
     * Group image (optional).
     */
    image: string|undefined;
    /**
     * Group background color in RGBa format.
     */
    color: string;
    /**
     * All entires in the group.
     * Each entry represents a row in the group.
     */
    entries: Entry[];
}

export interface Entry {
    /**
     * Entry name.
     */
    title: string;
    /**
     * Flag to indicate if the entry is checked.
     */
    checked: boolean;
    /**
     * Entry image (optional).
     */
    image: string|undefined;
    /**
     * Entry price (optional).
     */
    price: number|undefined;
}
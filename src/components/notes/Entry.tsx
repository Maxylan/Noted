import React, { useContext, useState, useEffect } from 'react';
import { useAuthorization } from '../../features/Authorization/Authorization';
import { 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';

export interface EntryProps extends JSX.IntrinsicAttributes {
    /**
     * The entry.
     */
    entry: EntryType;
    /**
     * Is editable? / Enable edit-related functionality.
     */
    editable: boolean;
    /**
     * Position in Note.entries (2D Because of Groups)
     */
    index: [number, number];
    /**
     * React dispatch event to update the state of Entries in the Note.
     */
    setEntries: React.Dispatch<React.SetStateAction<(EntryType | GroupType)[]>>;
}

/**
 * A single entry into a note.
 * @param props 
 * @returns 
 */
export default function Entry({entry, editable, index, setEntries}: EntryProps): JSX.Element {
    const authorizationStatus = useAuthorization();

    useEffect(() => {
    }, []);

    return (
        <div className={['Entry'].join(' ')}>
            <input 
                type='checkbox' 
                className={['mr-4'].join(' ')}
                checked={entry.checked} 
                onChange={(e) => setEntries(oldEntries => {
                    let oldEntriesCopy = [...oldEntries];
                    let isPartOfGroup = oldEntriesCopy[index[0]].hasOwnProperty('entries');
                    let oldEntry = (isPartOfGroup ? (oldEntriesCopy[index[0]] as GroupType).entries[index[1]] : oldEntriesCopy[index[0]]) as EntryType;
                    oldEntry.checked = e.target.checked;
                    return oldEntriesCopy;
                })}
                disabled={!editable} />
            <span>{entry.title}</span>
            {entry.price && <span className={'float-right'}>{`${entry.price}:-`}</span>}
        </div>
    )
} 
import React, { useContext, useState, useEffect, useRef } from 'react';
import { useAuthorization } from '../../features/Authorization/Authorization';
import { isGroup } from "../../utils/helpers";
import { 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


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
    const [titleIsBeingEdited, setTitleIsBeingEdited] = useState<boolean>(false);
    const [priceIsBeingEdited, setPriceIsBeingEdited] = useState<boolean>(false);
    const authorizationStatus = useAuthorization();
    const titleInputRef = useRef<any>();
    const priceInputRef = useRef<any>();

    useEffect(() => {
        if (titleIsBeingEdited) { titleInputRef.current?.focus(); }
        if (priceIsBeingEdited) { priceInputRef.current?.focus(); }
    }, [titleIsBeingEdited, priceIsBeingEdited]);

    const updateEntry = (key: keyof EntryType, value: any) => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];
            let isPartOfGroup = isGroup(oldEntriesCopy[index[0]]);
            let oldEntry = (isPartOfGroup ? (oldEntriesCopy[index[0]] as GroupType).entries[index[1]] : oldEntriesCopy[index[0]]) as EntryType;
            
            if (value === 'deleteValueIfPresent') {
                delete (oldEntry as EntryType)[key];
            }
            else {
                ((oldEntry as EntryType)[key] as any) = value; // What??
            }
            
            return oldEntriesCopy;
        });
    }

    return (
        <div className={['Entry'].join(' ')}>
            {entry.hasOwnProperty('checked') && 
                <input 
                    type='checkbox' 
                    className={['mr-4'].join(' ')}
                    checked={entry.checked} 
                    onChange={(e) => updateEntry('checked', e.target.checked)} />
            }
            <span onClick={editable ? () => setTitleIsBeingEdited(true) : undefined}>
                    {titleIsBeingEdited ? (
                        <input 
                            ref={titleInputRef}
                            type='text' 
                            maxLength={40}
                            className={['w-48'].join(' ')}
                            defaultValue={entry.title} 
                            onBlur={(e) => {
                                if (e.target.value.length <= 40) {
                                    updateEntry('title', e.target.value);
                                    setTitleIsBeingEdited(false);
                                }
                            }} />
                    ) : (
                        <div className={['inline-block', 'max-w-[12rem]'].join(' ')}>{ entry.title }</div>
                    )}
            </span>
            <span className={'float-right'} onClick={editable ? () => setPriceIsBeingEdited(true) : undefined}>
                    {priceIsBeingEdited ? (
                        <input 
                            ref={priceInputRef}
                            type='number' 
                            className={['w-16'].join(' ')}
                            size={1}
                            maxLength={5}
                            defaultValue={entry.price} 
                            onBlur={(e) => {
                                if (e.target.value.length <= 5) {
                                    let value = parseFloat(e.target.value);
                                    updateEntry('price', (e.target.value && value && !isNaN(value) && !Number.isNaN(value)) ? 
                                        parseFloat(e.target.value) : 
                                        'deleteValueIfPresent');
                                }
                                setPriceIsBeingEdited(false);
                            }} />
                    ) : (entry.price ? 
                        (<>{`${entry.price}:-`}</>): 
                        (editable ? (<MoneyOffIcon fontSize={'small'} className={['text-highlight'].join(' ')}/>) : (<></>)))
                    }
            </span>
        </div>
    )
} 
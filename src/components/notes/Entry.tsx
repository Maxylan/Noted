import React, { useContext, useState, useEffect, useRef } from 'react';
import { useAuthorization } from '../../features/Authorization/Authorization';
import { isGroup } from "../../utils/helpers";
import { 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DeleteIcon from '@mui/icons-material/Delete';
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
    const titleInputRef = useRef<any>();
    const priceInputRef = useRef<any>();
    const authorizationStatus = useAuthorization();

    useEffect(() => { // For editing title/price
        if (titleIsBeingEdited) { titleInputRef.current?.focus(); }
        if (priceIsBeingEdited) { priceInputRef.current?.focus(); }
    }, [titleIsBeingEdited, priceIsBeingEdited]);

    const updateEntry = (key: keyof EntryType|undefined, value: any) => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];
            let isPartOfGroup = isGroup(oldEntriesCopy[index[0]]);
            let oldEntry = (isPartOfGroup ? (oldEntriesCopy[index[0]] as GroupType).entries[index[1]] : oldEntriesCopy[index[0]]) as EntryType;

            if (typeof key === 'undefined') {
                if (isPartOfGroup) {
                    (oldEntriesCopy[index[0]] as GroupType).entries.splice(index[1], 1);

                    if ((oldEntriesCopy[index[0]] as GroupType).entries.length === 0) {
                        oldEntriesCopy.splice(index[0], 1);
                    }
                } else {
                    oldEntriesCopy.splice(index[0], 1);
                }
            }
            else if (oldEntry) {
                if (value === 'deleteValueIfPresent') {
                    if (oldEntry && oldEntry.hasOwnProperty(key)) {
                        delete (oldEntry as EntryType)[key];
                    }
                }
                else {
                    ((oldEntry as EntryType)[key] as any) = value; // What??
                }
            }
            
            return oldEntriesCopy;
        });
    }

    const updateTitle = (e: React.FocusEvent) => { 
        e.stopPropagation(); 
        setTimeout(() => {
            let value = (e.target as HTMLInputElement).value;
            console.log('value', value);

            // if (e.target.value.length <= 40) {
            if (value && value.length <= 40) {
                updateEntry('title', value);
                setTitleIsBeingEdited(false);
            }
        }, 0);
    }

    return (
        <div className={['Entry', 'mt-0.5'].join(' ')}>
            {entry.hasOwnProperty('checked') && 
            <input 
                type='checkbox' 
                className={['mr-4'].join(' ')}
                checked={entry.checked} 
                onChange={(e) => updateEntry('checked', e.target.checked)} />
            }
            <span 
                onClick={editable ? () => setTitleIsBeingEdited(true) : undefined}
                onBlur={updateTitle}>
                {titleIsBeingEdited ? (
                    <input 
                        id={'titleInput'}
                        ref={titleInputRef}
                        onBlur={updateTitle}
                        type='text' 
                        maxLength={40}
                        className={['w-48'].join(' ')}
                        defaultValue={entry.title}  />
                ) : (
                    <div className={['inline-block', 'max-w-[12rem]'].join(' ')}>{ entry.title }</div>
                )}
            </span>
            <span className={'float-right'} onClick={editable ? () => setPriceIsBeingEdited(true) : undefined}>
                {titleIsBeingEdited ? (
                    <DeleteIcon className={['inline-block', 'text-scrap'/*, 'w-4', 'h-4'*/].join(' ')} onClick={() => updateEntry(undefined, undefined)}/>
                ) : (
                priceIsBeingEdited ? (
                    <input 
                        ref={priceInputRef}
                        type='number' 
                        className={['w-16'].join(' ')}
                        size={1}
                        maxLength={5}
                        defaultValue={entry.price} 
                        onBlur={(e) => {
                            console.warn('e.target.value', e.target.value);
                            if (e.target.value.length <= 5) {
                                let value = parseFloat(e.target.value);
                                console.warn('(e.target.value && value && !isNaN(value) && !Number.isNaN(value))', (e.target.value && value && !isNaN(value) && !Number.isNaN(value)));
                                updateEntry('price', (e.target.value && value && !isNaN(value) && !Number.isNaN(value)) ? 
                                    parseFloat(e.target.value) : 
                                    'deleteValueIfPresent');
                            }
                            setPriceIsBeingEdited(false);
                        }} />
                ) : (entry.price ? 
                    (<>{`${entry.price}:-`}</>): 
                    (editable ? (<MoneyOffIcon fontSize={'small'} className={['text-highlight'].join(' ')}/>) : (<></>)))
                )}
            </span>
        </div>
    )
} 
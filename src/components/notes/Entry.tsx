import React, { useContext, useState, useEffect, useRef } from 'react';
import { useApi, useAuthorization, useDebounce } from '../../features/api/HttpWrapper';
import { isGroup } from "../../utils/helpers";
import { 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '../misc/Modal';
import { Product } from '../../types/api';
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
    const [title, setTitle] = useState<string>(entry.title);
    const [titleIsBeingEdited, setTitleIsBeingEdited] = useState<boolean>(false);
    const [priceIsBeingEdited, setPriceIsBeingEdited] = useState<boolean>(false);
    const titleInputRef = useRef<any>();
    const priceInputRef = useRef<any>();
    const status = useAuthorization();
    const api = useApi() as {
        [key: string]: any /* I don't know how to define variable amount of arguments! :D ({...args}) => Promise<StdResponse<any>> */;
    };
    const [result, loading, debounce] = useDebounce((value) => {
        if (value && status.health === 'healthy') {
            return api.search(value, 'quick');
        }
    }, 1000);

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

    const updateTitle = (e: /*React.FocusEvent|undefined*/ any = undefined) => { 
        if (!e) {
            e = {target: titleInputRef.current}
        }
        else {
            e.stopPropagation(); 
        }

        setTimeout(() => {
            let value = (e.target as HTMLInputElement).value;

            // if (e.target.value.length <= 40) {
            if (value && value.length <= 40) {
                updateEntry('title', value);
                setTitleIsBeingEdited(false);
            }
        }, 0);
    }

    return (
        <div className={['Entry', 'mt-0.5', 'flex', 'align-center'].join(' ')}>
            {entry.hasOwnProperty('checked') && 
            <input 
                type='checkbox' 
                className={['flex-none', 'mr-2'].join(' ')}
                checked={entry.checked} 
                onChange={(e) => updateEntry('checked', e.target.checked)} />
            }
            <div 
                className={['flex-auto', 'w-full'].join(' ')}
                onClick={editable ? () => setTitleIsBeingEdited(true) : undefined}>
                {titleIsBeingEdited ? (
                    status.health === 'healthy' && window.innerWidth >= 768 ? (
                        <input 
                            id={'titleInput'}
                            ref={titleInputRef}
                            onBlur={updateTitle}
                            type='text' 
                            maxLength={40}
                            className={['w-48'].join(' ')}
                            defaultValue={entry.title} />
                    ) : (
                        <Modal visible={true} setVisibility={() => updateTitle()}>
                            <span className='items-center align-center justify-center'>
                                <input 
                                    type='text' 
                                    id={'titleInput'}
                                    ref={titleInputRef}
                                    className={['inline-block', 'w-48'].join(' ')}
                                    maxLength={40}
                                    onChange={(e) => {
                                        setTitle(e.target.value);

                                        if (e.target.value) {
                                            debounce(e.target.value);
                                        }
                                    }}
                                    value={title} />
                                <DeleteIcon className={['inline-block', 'text-scrap', 'ml-4'].join(' ')} onClick={() => updateEntry(undefined, undefined)}/>
                            </span>
                            <div className={['max-h-96', 'overflow-auto'].join(' ')}>
                                {loading ? <img src='/loader.svg' className='w-24 m-auto' alt='Loading..'/> : (
                                <ul>
                                    {(result && result.data) && result.data.map((product: Product) => 
                                        <li className={['flex', 'flex-row', 'my-2'].join(' ') + (product.price.promotion && (product.price.promotion as any)?.length > 0 ? ' bg-third' : (product.lowPrice ? ' bg-secondary' : ''))} key={product.id}
                                            onClick={() => {
                                                updateEntry('image', `${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.PICTURE_BASE_URL}/${product.cover.url}`);
                                                updateEntry('price', product.price.current);
                                                updateEntry('title', product.name);
                                            }}>
                                            <div className={['inline-block', 'flex-none', 'flex', 'w-[5rem]', 'h-[5rem]', 'bg-white', 'rounded-md', 'border-highlight', 'border-2', 'mr-2', 'overflow-hidden', 'align-center', 'justify-center', 'items-center'].join(' ')}>
                                                <img
                                                    className={['max-w-[4rem]', 'max-h-[4rem]'].join(' ')} 
                                                    src={`${Staffanshopper.grossconfig.HOST}${Staffanshopper.grossconfig.PICTURE_BASE_URL}/${product.cover.url}`} />
                                            </div>
                                            <div className={['inline-block'].join()}>
                                                <span className={['text-base'].join()}>
                                                    {product.name.length > 50 ? `${product.name.substring(0, 47)}...` : product.name}
                                                </span>
                                                <div>
                                                    {product.price.unit === 'KGM' ? `${product.price.current} / kg` : `${product.price.current}:-`}
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>)}
                            </div>
                        </Modal>
                    )
                ) : (
                    <div className={['inline-block', 'max-w-[12rem]', 'flex', 'flex-row'].join(' ')}>
                        {entry.image && <span className='inline-block'><img src={entry.image} className={['max-w-[2rem]', 'max-h-[2rem]', 'flex-none', 'mr-2'].join(' ')} /></span>}
                        <span className={'inline-block'}>{entry.title}</span>
                    </div>
                )}
            </div>
            <div className={'flex-none'} onClick={editable ? () => setPriceIsBeingEdited(true) : undefined}>
                {titleIsBeingEdited && window.innerWidth >= 768 ? (
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
                )}
            </div>
        </div>
    )
} 
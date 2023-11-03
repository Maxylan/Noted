import React, { useContext, useState, useEffect, useRef } from 'react';
import Settings from '../../features/settings';
import { useApi, useAuthorization, useDebounce } from '../../features/api/HttpWrapper';
import { isGroup, round } from "../../utils/helpers";
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
    const [amountBeingEdited, setAmountBeingEdited] = useState<false|{
        pid: string;
        image: string;
        imageAlt: string;
        price: number;
        amount: number|undefined;
        unit: string;
        title: string;
    }>(false);
    const titleInputRef = useRef<any>();
    const priceInputRef = useRef<any>();
    const amountInputRef = useRef<any>();
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
        if (amountBeingEdited) { amountInputRef.current?.focus(); }
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

    const update = (e: /*React.FocusEvent|undefined*/ any = undefined) => { 
        if (!e) {
            e = {target: titleInputRef.current}
        }
        else {
            e.stopPropagation(); 
        }

        setTimeout(() => {
            let value = (e.target as HTMLInputElement).value;
            // If it (was) an actual product, and the title changes, clear previous product details like `pid` and `image`.
            if (value !== entry.title && entry.pid) {
                updateEntry('pid', 'deleteValueIfPresent');
                updateEntry('image', 'deleteValueIfPresent');
                updateEntry('imageAlt', 'deleteValueIfPresent');
            }

            // if (e.target.value.length <= 40) {
            if (value && value.length <= 40) {
                // Product details are stored in `amountBeingEdited` if its an actual product (yes I know its confusing, but it works!)
                if (amountBeingEdited) {
                    updateEntry('pid', amountBeingEdited.pid);
                    updateEntry('image', amountBeingEdited.image);
                    updateEntry('imageAlt', amountBeingEdited.imageAlt);
                    updateEntry('amount', (amountInputRef.current.value || 1));
                    updateEntry('price', amountBeingEdited.price);
                    updateEntry('unit', amountBeingEdited.unit);
                }

                updateEntry('title', value);
                setTitleIsBeingEdited(false);
            }
        }, 0);
    }

    return (
        <div className={['Entry', 'mt-0.5', 'my-1', 'flex', 'align-center'].join(' ')}>
            {entry.hasOwnProperty('checked') && 
            <input 
                type='checkbox' 
                className={['flex-none', 'mr-2'].join(' ')}
                checked={entry.checked} 
                onChange={(e) => updateEntry('checked', e.target.checked)} />
            }
            <div 
                className={['flex-auto', 'w-full'].join(' ')}
                onClick={editable ? () => {
                    setTitleIsBeingEdited(true); 
                    if (entry.pid) {
                        setAmountBeingEdited({
                            pid: entry.pid,
                            image: entry.image!,
                            imageAlt: entry.imageAlt!,
                            price: entry.price!,
                            amount: entry.amount!,
                            unit: entry.unit!,
                            title: entry.title,
                        });
                    }
                } : undefined}>
                {titleIsBeingEdited ? (
                    status.health === 'healthy' ? (
                        <Modal visible={true} setVisibility={() => update()}>
                            <span className='items-center align-center justify-center'>
                                <input 
                                    type='text' 
                                    id={'titleInput'}
                                    ref={titleInputRef}
                                    className={['inline-block', 'w-48'].join(' ')}
                                    maxLength={40}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setAmountBeingEdited(false);

                                        if (e.target.value && status.health === 'healthy') {
                                            debounce(e.target.value);
                                        }
                                    }}
                                    value={title} />
                                <DeleteIcon className={['inline-block', 'text-scrap', 'ml-4'].join(' ')} onClick={() => updateEntry(undefined, undefined)}/>
                            </span>
                            <div className={['max-h-96', 'overflow-auto'].join(' ')}>
                                {amountBeingEdited ? (
                                    <div className='mt-4'>
                                        <label className='inline-block'>
                                            Amount:
                                            <span className={['inline-block', 'ml-2'].join(' ')}>
                                                <input 
                                                    id='amountInput'
                                                    ref={amountInputRef}
                                                    type='number' 
                                                    defaultValue={amountBeingEdited.amount || 1} 
                                                    className={['w-16'].join(' ')} />
                                                {amountBeingEdited.unit === 'KGM' ? 'KG' : ''}
                                            </span>
                                        </label>
                                    </div>
                                ) : loading ? <img src='/loader.svg' className='w-24 m-auto' alt='Loading..'/> : (
                                    <ul>
                                        {(result && result.data) && result.data.map((product: Product) => 
                                            <li className={['flex', 'flex-row', 'my-2'].join(' ') + (product.price.promotion && (product.price.promotion as any)?.length > 0 ? ' bg-third' : (product.lowPrice ? ' bg-secondary' : ''))} key={product.id}
                                                onClick={() => {
                                                    setTitle(product.name);
                                                    setAmountBeingEdited({
                                                        pid: product.id,
                                                        image: `${app.grossconfig.HOST}${app.grossconfig.PICTURE_BASE_URL}/${product.cover.url}`,
                                                        imageAlt: product.cover.alt,
                                                        price: product.price.current,
                                                        unit: product.price.unit,
                                                        amount: undefined,
                                                        title: product.name,
                                                    });
                                                }}>
                                                <div className={['inline-block', 'flex-none', 'flex', 'w-[5rem]', 'h-[5rem]', 'bg-white', 'rounded-md', 'border-highlight', 'border-2', 'mr-2', 'overflow-hidden', 'align-center', 'justify-center', 'items-center'].join(' ')}>
                                                    <img
                                                        alt={product.cover.alt} 
                                                        src={`${app.grossconfig.HOST}${app.grossconfig.PICTURE_BASE_URL}/${product.cover.url}`}
                                                        className={['max-w-[4rem]', 'max-h-[4rem]'].join(' ')} />
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
                                    </ul>
                                )}
                            </div>
                        </Modal>
                    ) : (
                        <input 
                            id={'titleInput'}
                            ref={titleInputRef}
                            onBlur={(e) => updateEntry('title', e.target.value)}
                            type='text' 
                            maxLength={40}
                            className={['w-48'].join(' ')}
                            defaultValue={entry.title} />
                    )
                ) : (
                    <div className={['inline-block', 'max-w-[12rem]', 'flex', 'flex-row'].join(' ')}>
                        {(Settings.showImages() && entry.image) && (
                            <span className='inline-block'>
                                <img src={entry.image} alt={entry.imageAlt} className={['max-w-[2rem]', 'max-h-[2rem]', 'flex-none', 'mr-2'].join(' ')} />
                            </span>
                        )}
                        <span className={['inline-block'].join(' ') + ' ' + ((text) => {
                            if (text.split(' ').some((word) => word.length >= 12)) {
                                return 'text-lg';
                            }
                            else {
                                return 'text-xl';
                            }
                        })(entry.title)}>{`${entry.amount ? `(${entry.amount}${entry.unit === 'KGM' ? ' kg' : ''}) ` : ''}${entry.title}`}</span>
                    </div>
                )}
            </div>
            <div className={['flex-none', 'inline-block', 'flex', 'items-center'].join(' ')} onClick={editable ? () => setPriceIsBeingEdited(true) : undefined}>
                <span className='inline-block'>
                    {!titleIsBeingEdited && ( // If title is NOT being edited..
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
                            `${round(entry.price * (entry.amount || 1))}:-`: 
                            (editable ? (<MoneyOffIcon fontSize={'small'} className={['text-highlight'].join(' ')}/>) : (<></>)))
                    )}
                </span>
            </div>
        </div>
    )
} 
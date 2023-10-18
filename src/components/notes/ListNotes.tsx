import React, { useState, useEffect, useRef } from 'react';
import { 
    date,
    dayName,
    argToDate,
    dateKey, 
    getMonthName,
    isGroup, 
    hasGroups,
    hasChecked,
    generateUUID, 
    reduceEntries,
    reduceGroupEntries,
    reduceCheckedEntries,
    toBase64
} from "../../utils/helpers";
import Pages from '../../types/pages';
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
import { 
    getNotes,
    clearNotesCache,
    deleteNote
} from "../../utils/store";
import Modal from "../misc/Modal";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SyncIcon from '@mui/icons-material/Sync';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface MonthDetails {
    year: number;
    month: number;
    name: string;
    notes: Note[];
}

export interface ListNotesProps extends JSX.IntrinsicAttributes {
    load: (note: Note) => void;
    resetCurrentNote: () => void;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
}

/**
 * View all Notes sorted by month.
 * @param props 
 * @returns 
 */
export default function ListNotes(props: ListNotesProps): JSX.Element {
    const [visibilityMonthlyDetails, setVisibilityMonthlyDetails] = useState<boolean>(false);
    const [month, setMonth] = useState<MonthDetails|undefined>(); // For details
    const [note, setNote] = useState<Note|undefined>(); // For details, export and "confirm delete" prompt
    const [visibilityNoteDetails, setVisibilityNoteDetails] = useState<boolean>(false);
    const [visibilityNoteExport, setVisibilityNoteExport] = useState<boolean>(false);
    const [visibilityConfirmDelete, setVisibilityConfirmDelete] = useState<boolean>(false);

    const [notes, setNotes] = useState<(Note[])[]>([]);
    const [search, setSearchValue] = useState<string>('');
    const [monthsToFetch, setMonthsToFetch] = useState(4);
    const [endReached, setEndReached] = useState<boolean>(false);

    const bodyOnClickEventHandler = function (e: MouseEvent) {
        // WHAT THE ACTUAL F$@* IS THIS?!
        /** Begin stupid 💩 */
        const target = (e.target as any); 
        /* (in)sanity check
        console.log(target);
        console.log(target.className);
        console.log(typeof target.className);
        console.log(target.className.baseVal);
        */
        let className = typeof target.className === 'object' ? target.className.baseVal : target.className;
        // console.log(className);
        /** End stupid 💩 */

        if (className.includes('More')) {
            return;
        }

        let elements = document.getElementsByClassName('Dropdown');
        for (let i = 0; i < elements.length; i++) {
            if (elements[i]) {
                (elements[i] as any).style.display = 'none';
            }
        };
    };

    useEffect(() => {
        document.body.addEventListener('click', bodyOnClickEventHandler);
        return () => document.body.removeEventListener('click', bodyOnClickEventHandler);
    }, []);

    const fetchNotes = () => {
        let _notes: Note[][] = [];

        // year + month extrapolated from dateKey().
        let [y, m] = dateKey().split('_').map((n) => parseInt(n));
        for (let i = 0; i < monthsToFetch; i++) {
            if (m - i < 1) { y -= 1; m = 12; }
            let monthlyNotes = getNotes(`${y}_${m - i}`);
            if (monthlyNotes) { 
                _notes.push(Object.values(monthlyNotes));
            } else {
                setEndReached(true);
                break;
            }
        }
        
        setNotes(oldNotes => _notes);
    }

    useEffect(() => {
        fetchNotes();
    }, [monthsToFetch]);

    const showMonthlyInfo = (_month: MonthDetails) => {
        setMonth(_month);
        setVisibilityMonthlyDetails(true);
    }
    const showNoteInfo = (_note: Note) => {
        setNote(_note);
        setVisibilityNoteDetails(true);
    }
    const showNoteData = (_note: Note) => {
        setNote(_note);
        setVisibilityNoteExport(true);
    }
    const showConfirmDeleteNote = (_note: Note) => {
        setNote(_note);
        setVisibilityConfirmDelete(true);
    }

    const editNote = (_note: Note) => {
        _note.editable = true;
        props.load(_note); 
        props.setCurrentPage(Pages.EditNote);
    }
    const deleteCurrentNote = () => {
        // setLoading(true); // To trigger a re-render.
        props.resetCurrentNote(); // Reset internally stored "current note", if any.
        deleteNote(note!.id); // Delete note from localStorage. Also clears cache.
        setNote(undefined); // Reset note state in this ListNotes.
        setVisibilityConfirmDelete(false); // Hide the "confirm delete" prompt modal.
        fetchNotes(); // Refetch notes.
        // setLoading(false); // Render the list anew.
    }

    return (
        <div className={['ListNotes', 'w-full', 'text-2xl', 'text-left'].join(' ')}>
            <input className={['Search', 'w-3/4', 'text-xl', 'mb-4', 'rounded-sm', 'shadow-inner', 'shadow-inner-md', 'inline-block'].join(' ')}
                type='text'
                onChange={(e) => setSearchValue(e.target.value)}
                value={search}/>
            <SearchOutlinedIcon className={['inline-block', 'ml-2'].join(' ')}/>
            {notes.map((monthlyNotes, i) => {
                let [y, m] = dateKey().split('_').map((n) => parseInt(n)); // year + month extrapolated from dateKey().
                if (m - i < 1) { y -= 1; m = 12; }
                return (
                    <div key={generateUUID()} className={['h-fit', 'w-full', 'rounded-lg', 'bg-secondary', 'py-2', 'shadow-inner', 'shadow-inner-lg'].join(' ')}>
                        <div className={['h-fit', 'text-2xl', 'mt-2', 'mb-4', 'mx-4'].join(' ')}>
                            <span className={['inline-block'].join(' ')}>{`${y} - ${getMonthName(m)}`}</span>
                            <InfoOutlinedIcon className={['inline-block', 'float-right', 'mt-[6px]', 'cursor-pointer'].join(' ')} onClick={() => showMonthlyInfo({year: y, month: m, name: getMonthName(m)!, notes: monthlyNotes})}/>
                        </div>
                        {[...monthlyNotes].reverse().filter((_note) => {
                            return _note.title.toLowerCase().includes(search.toLowerCase()) || _note.entries.some((entry) => isGroup(entry) && entry.title.toLowerCase().includes(search.toLowerCase()));
                        }).map((_note) => (
                            <div key={generateUUID()} className={['text-lg', 'bg-third', 'hover:bg-highlight', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'my-2', 'pl-8', 'pr-4', 'py-[0.25rem]', 'mx-2', 'flex', 'cursor-pointer', 'select-none'].join(' ')}>
                                <span className={['inline-block', 'w-full'].join(' ')} onClick={(e) => { e.stopPropagation(); props.load(_note); props.setCurrentPage(Pages.EditNote); }}>
                                    {_note.title}
                                </span>
                                <div className='Dropdown relative' id={`dropdown_${_note.id}`} style={{display: 'none'}}>
                                    <div className={['bg-secondary', 'w-32', 'h-fit', 'absolute', 'left-[-4rem]', 'top-8', 'rounded-lg', 'shadow-lg'].join(' ')}>
                                        <div className={['flex', 'flex-col'].join(' ')}>
                                            <div className={['Button', 'block', 'w-full', 'z-10', 'px-4', 'py-2', 'bg-secondary', 'hover:bg-third', 'rounded-t-lg'].join(' ')} onClick={() => showNoteInfo(_note)}>Info</div>
                                            <div className={['Button', 'block', 'w-full', 'z-10', 'px-4', 'py-2', 'bg-secondary', 'hover:bg-third'].join(' ')} onClick={() => editNote(_note)}>Edit</div>
                                            <div className={['Button', 'block', 'w-full', 'z-10', 'px-4', 'py-2', 'bg-secondary', 'hover:bg-third'].join(' ')} onClick={() => showNoteData(_note)}>Export</div>
                                            <div className={['Button', 'block', 'w-full', 'z-10', 'px-4', 'py-2', 'bg-secondary', 'hover:bg-third', 'rounded-b-lg'].join(' ')} onClick={() => showConfirmDeleteNote(_note)}>Delete</div>
                                        </div>
                                    </div>
                                    <div className={['bg-secondary', 'rotate-45', 'w-6', 'h-6', 'absolute', 'left-[-3.66rem]', 'top-6'].join(' ')} />
                                </div>
                                <div onClick={() => {
                                        let element = document.getElementById(`dropdown_${_note.id}`);
                                        if (element) {
                                            if (element.style.display === 'none') {
                                                element.style.display = 'initial';
                                            } else {
                                                element.style.display = 'none';
                                            }
                                        }
                                    }}>
                                    <MoreHorizOutlinedIcon className={['More', 'inline-block', '!w-10'].join(' ')} />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
            <div className={['w-full', 'h-fit', 'flex', 'flex-col', 'items-center'].join(' ')}>
                {endReached || (
                    <button 
                        className={['mt-8', 'w-3/4', 'h-fit', 'p-[0.25rem]', 'text-lg', 'rounded-lg', 'bg-secondary', 'shadow-sm', 'hover:shadow-md'].join(' ')}
                        onClick={() => setMonthsToFetch(oldValue => oldValue + 4)}>Load more..</button>
                )}
            </div>
            <Modal visible={visibilityMonthlyDetails} setVisibility={setVisibilityMonthlyDetails}>
                {month && <>
                    <p>{`${month.year}/${month.month} (${month.name})`}</p>
                    <br/>
                    <div className={['MonthDetails', 'text-lg'].join(' ')}>
                        <div className={['rounded-t-lg', 'p-2', 'bg-third', 'shadow-md'].join(' ')}>
                            <p>Notes: {month.notes.length}</p>
                        </div>
                        <div className={['p-2', 'bg-third', 'shadow-md', 'border-primary', 'border-y-[2px]'].join(' ')}>
                            <p>Total Cost: {month.notes.map((_note) => reduceEntries(_note.entries)).reduce((p, c) => p + c)}:-</p>
                            <p>Total Cost {'(Groups)'}: {month.notes.map((_note) => reduceGroupEntries(_note.entries)).reduce((p, c) => p + c)}:-</p>
                            <p>Total Cost {'(Checked)'}: {month.notes.map((_note) => reduceCheckedEntries(_note.entries)).reduce((p, c) => p + c)}:-</p>
                        </div>
                        <div className={['rounded-b-lg', 'p-2', 'bg-third', 'shadow-md'].join(' ')}>
                            <p>More info to be added...</p>
                        </div>
                    </div>
                </>}
            </Modal>
            <Modal visible={visibilityNoteDetails} setVisibility={setVisibilityNoteDetails}>
                {note && <>
                    <p>{note.title}</p>
                    <br/>
                    <div className={['NoteDetails', 'text-lg'].join(' ')}>
                        <div className={['rounded-t-lg', 'p-2', 'bg-third', 'shadow-md'].join(' ')}>
                            <p>Created:<br/>{`${argToDate(note.created)} (${dayName(note.created, 'en')})`}</p>
                            <p>Last Updated:<br/>{`${argToDate(note.updated)} (${dayName(note.updated, 'en')})`}</p>
                        </div>
                        <div className={['p-2', 'bg-third', 'shadow-md', 'border-primary', 'border-y-[2px]'].join(' ')}>
                            <p>Cost: {reduceEntries(note.entries)}:-</p>
                            {hasGroups(note.entries) && 
                                <p>{`Cost (Groups): ${reduceGroupEntries(note.entries)}:-`}</p>
                            }
                            {hasChecked(note.entries) && 
                                <p>{`Cost (Checked): ${reduceCheckedEntries(note.entries)}:-`}</p>
                            }
                        </div>
                        <div className={['rounded-b-lg', 'p-2', 'bg-third', 'shadow-md'].join(' ')}>
                            <p>More info to be added...</p>
                        </div>
                    </div>
                </>}
            </Modal>
            <Modal visible={visibilityNoteExport} setVisibility={setVisibilityNoteExport}>
                {note && 
                    <label className='text-lg'> 
                        Copy me! 
                        <span className='text-sm ml-4'>{`(${note.title})`}</span>
                        <input type='text' className={['text-sm', 'min-w-[16rem]', 'w-full', 'shadow-inner', 'shadow-inner-md'].join(' ')} value={toBase64(note)} readOnly={true} onFocus={(e) => {
                            setTimeout(() => {
                                // let element = document.getElementsByClassName('Modal')[0].getElementsByTagName('input')[0];
                                // element.focus();
                                e.target.select();
                            }, 0); 
                        }} />
                    </label>
                }
            </Modal>
            <Modal visible={visibilityConfirmDelete} setVisibility={setVisibilityConfirmDelete}>
                {note && 
                    <div className='text-center'>
                        <p className={['text-2xl', 'font-bold', 'mb-4'].join(' ')}>Delete Note</p>
                        <p className={['text-xl', 'mb-4'].join(' ')}>Are you sure you want to delete<br/>"{note.title}"?</p>
                        <div className={['w-full', 'flex', 'flex-col', 'justify-center', 'items-center'].join(' ')}>
                            <button className={['w-1/2', 'h-fit', 'mr-2', 'p-2', 'rounded-lg', 'bg-highlight', 'shadow-md', 'hover:shadow-lg'].join(' ')} onClick={() => deleteCurrentNote()}>
                                <span className={['inline-block', 'align-middle'].join(' ')}>Delete</span>
                                <br/>
                                <span className={['inline-block', 'align-middle', 'text-base'].join(' ')}>{'(irreversible)'}</span>
                            </button>
                            <button className={['Cancel', 'w-1/2', 'h-fit', 'mt-4', 'p-2', 'rounded-lg', 'bg-secondary', 'shadow-md', 'hover:shadow-lg'].join(' ')} onClick={() => setVisibilityConfirmDelete(false)}>Cancel</button>
                        </div>
                    </div>
                }
            </Modal>
        </div>
    );
} 
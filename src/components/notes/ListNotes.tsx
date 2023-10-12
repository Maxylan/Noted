import React, { useState, useEffect, useRef } from 'react';
import { 
    dateKey, 
    getMonthName,
    isGroup, 
    generateUUID, 
    reduceEntries 
} from "../../utils/helpers";
import Pages from '../../types/pages';
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
import { 
    getNotes 
} from "../../utils/store";
import Modal from "../misc/Modal";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface ListNotesProps extends JSX.IntrinsicAttributes {
    load: (note: Note) => void;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
}

/**
 * View all Notes sorted by month.
 * @param props 
 * @returns 
 */
export default function ListNotes(props: ListNotesProps): JSX.Element {
    const [visibilityMonthlyDetails, setVisibilityMonthlyDetails] = useState<boolean>(false);
    const [visibilityNoteDetails, setVisibilityNoteDetails] = useState<boolean>(false);
    const [search, setSearchValue] = useState<string>('');
    const [notes, setNotes] = useState<(Note[])[]>([]);
    const [monthsToFetch, setMonthsToFetch] = useState(4);

    useEffect(() => {
        let _notes = [...notes];

        // year + month extrapolated from dateKey().
        let [y, m] = dateKey().split('_').map((n) => parseInt(n));
        for (let i = 0; i < monthsToFetch; i++) {
            if (m - i < 1) { y -= 1; m = 12; }
            let monthlyNotes = getNotes(`${y}_${m - i}`);
            if (monthlyNotes) { 
                _notes.push(Object.values(monthlyNotes));
            }
        }
        
        setNotes(_notes);
    }, [monthsToFetch]);

    return (
        <div className={['ListNotes', 'w-full', 'text-2xl', 'text-left'].join(' ')}>
            <input className={['Search', 'w-3/4', 'text-xl', 'mb-4', 'shadow-inner', 'shadow-inner-md', 'inline-block'].join(' ')}
                type='text'
                onChange={(e) => setSearchValue(e.target.value)}
                value={search}/>
            <SearchOutlinedIcon className={['inline-block', 'ml-2'].join(' ')}/>
            {(() => {
                let [y, m] = dateKey().split('_').map((n) => parseInt(n)); // year + month extrapolated from dateKey().
                return notes.map((monthlyNotes, i) => {
                    if (m - i < 1) { y -= 1; m = 12; }
                    return (
                        <div className={['h-fit', 'w-full', 'rounded-lg', 'bg-secondary', 'py-2', 'mb-8', 'shadow-inner', 'shadow-inner-lg'].join(' ')}>
                            <div key={generateUUID()} className={['h-fit', 'text-2xl', 'mt-2', 'mb-4', 'mx-4'].join(' ')}>
                                <span className={['inline-block'].join(' ')}>{`${y} - ${getMonthName(m)}`}</span>
                                <InfoOutlinedIcon className={['inline-block', 'float-right', 'mt-[2.5px]'].join(' ')}/>
                            </div>
                            {monthlyNotes.reverse().filter((note) => {
                                return note.title.toLowerCase().includes(search.toLowerCase()) || note.entries.some((entry) => isGroup(entry) && entry.title.toLowerCase().includes(search.toLowerCase()));
                            }).map((note) => (<>
                                <div key={generateUUID()} className={['text-lg', 'bg-third', 'hover:bg-highlight', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'my-2', 'px-8', 'py-[0.25rem]', 'mx-2', 'flex'].join(' ')}>
                                    <span className={['inline-block', 'w-full'].join(' ')} onClick={(e) => { e.stopPropagation(); props.load(note); props.setCurrentPage(Pages.NewNote); }}>
                                        {note.title + (reduceEntries(note.entries) > 0 ? ` (${reduceEntries(note.entries)}:-)` : '')}
                                    </span>
                                    <div className='Dropdown relative' id={`dropdown_${note.id}`} style={{display: 'none'}}>
                                        <div className={['bg-secondary', 'w-32', 'h-fit', 'absolute', 'left-[-4rem]', 'top-8', 'rounded-lg', 'shadow-lg'].join(' ')}>
                                            <div className={['flex', 'flex-col'].join(' ')}>
                                                <div className={['block', 'w-full', 'z-10', 'px-4', 'py-2', 'hover:bg-third', 'rounded-t-lg'].join(' ')}>Info</div>
                                                <div className={['block', 'w-full', 'z-10', 'px-4', 'py-2', 'hover:bg-third'].join(' ')}>Edit</div>
                                                <div className={['block', 'w-full', 'z-10', 'px-4', 'py-2', 'hover:bg-third', 'rounded-b-lg'].join(' ')}>Delete</div>
                                            </div>
                                        </div>
                                        <div className={['bg-secondary', 'rotate-45', 'w-6', 'h-6', 'absolute', 'left-[-3.66rem]', 'top-6'].join(' ')} />
                                    </div>
                                    <MoreHorizOutlinedIcon className={['inline-block', 'mt-[2.5px]'].join(' ')} onClick={() => {
                                        let element = document.getElementById(`dropdown_${note.id}`);
                                        if (element) {
                                            if (element.style.display === 'none') {
                                                element.style.display = 'initial';
                                            } else {
                                                element.style.display = 'none';
                                            }
                                        }
                                    }}/>
                                </div>
                            </>))}
                        </div>
                    );
                });
            })()}
            <button onClick={() => setMonthsToFetch(oldValue => oldValue + 4)}></button>
            <Modal visible={visibilityMonthlyDetails} setVisibility={setVisibilityMonthlyDetails}>

            </Modal>
            <Modal visible={visibilityNoteDetails} setVisibility={setVisibilityNoteDetails}>
            </Modal>
        </div>
    )
} 
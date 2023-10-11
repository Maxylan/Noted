import React, { useState, useEffect, useRef } from 'react';
import { 
    dateKey, 
    getMonthName,
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
        <div className={['ListNotes', 'w-full', 'text-2xl', 'mb-24', 'md:mb-0', 'text-left'].join(' ')}>
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
                            {monthlyNotes.map((note) => (<>
                                <div className={['text-lg', 'bg-third', 'hover:bg-highlight', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'my-2', 'px-8', 'py-[0.25rem]', 'mx-2'].join(' ')} 
                                    key={generateUUID()} onClick={() => { props.load(note); props.setCurrentPage(Pages.NewNote); }}>
                                    <span className={['inline-block'].join(' ')}>
                                        {note.title + (reduceEntries(note.entries) > 0 ? ` (${reduceEntries(note.entries)}:-)` : '')}
                                    </span>
                                    <MoreHorizOutlinedIcon className={['inline-block', 'float-right', 'mt-[2.5px]'].join(' ')}/>
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
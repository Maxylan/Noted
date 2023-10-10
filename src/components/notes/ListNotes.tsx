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
    const [notes, setNotes] = useState<(Note[])[]>([]);
    const [monthsToFetch, setMonthsToFetch] = useState(4);

    useEffect(() => {
        let _notes = [...notes];
        let [y, m] = dateKey().split('_').map((n) => parseInt(n)); // year + month extrapolated from dateKey().
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
                    return (<>
                        <h2>{`${y} - ${getMonthName(m)}`}</h2>
                        <hr className='border-text'/>
                        {monthlyNotes.map((note) => <p className='text-base' onClick={() => { props.load(note); props.setCurrentPage(Pages.NewNote); }}>{note.title + (reduceEntries(note.entries) > 0 ? ` (${reduceEntries(note.entries)}:-)` : '')}</p>)}
                    </>);
                });
            })()}
            <button onClick={() => setMonthsToFetch(oldValue => oldValue + 4)}></button>
        </div>
    )
} 
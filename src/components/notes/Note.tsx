import React, { useState, useEffect, useRef } from 'react';
import { generateUUID, reduceEntries } from "../../utils/helpers";
import { 
    defaultNote, 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import Entry from './Entry';
import Group from './Group';
import EditIcon from '@mui/icons-material/Edit';

export interface NoteProps extends JSX.IntrinsicAttributes {
    note: NoteType;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setEditable: React.Dispatch<React.SetStateAction<boolean>>;
    setEntries: React.Dispatch<React.SetStateAction<(EntryType | GroupType)[]>>;
}

export const useNoteProps = (_note: NoteType = defaultNote()): NoteProps => {
    const [title, setTitle] = useState<string>(_note.title);
    const [editable, setEditable] = useState<boolean>(_note.editable);
    const [entries, setEntries] = useState<(EntryType|GroupType)[]>(_note.entries);
    const note: NoteType = {
        ..._note,
        title: title, 
        editable: editable, 
        entries: entries
    };

    /*
    useEffect(() => {
        setNote({
            title: title,
            entries: entries
        });
    }, [title, entries]);
    */

    return {
        note: note,
        setTitle: setTitle,
        setEditable: setEditable,
        setEntries: setEntries
    }
} 

/**
 * View/Create/Edit a note.
 * @param props 
 * @returns 
 */
export default function Note(props: NoteProps): JSX.Element {
    const [titleIsBeingEdited, setTitleIsBeingEdited] = useState<boolean>(false);
    const titleInputRef = useRef<any>();

    useEffect(() => {
        if (titleIsBeingEdited) { titleInputRef.current?.focus(); }
    }, [titleIsBeingEdited]);

    return (
        <div className={['EditNote', 'text-2xl'].join(' ')}>
            <div className={['NoteHeader', 'mt-4', 'mb-8'].join(' ')}>
                <span onClick={props.note.editable ? () => setTitleIsBeingEdited(true) : undefined}>
                    {titleIsBeingEdited ? (
                        <input 
                            ref={titleInputRef}
                            type='text' 
                            value={props.note.title} 
                            onChange={(e) => props.setTitle(e.target.value)} 
                            onBlur={() => setTitleIsBeingEdited(false)} />) : (
                        <>
                            {props.note.editable && <EditIcon className="mr-2" />}
                            {props.note.title}
                        </>)
                    }
                </span>
            </div>
            <div className={['NoteBody', 'text-xl', 'px-4', 'py-2', 'bg-secondary', 'rounded-lg', 'shadow-inner', 'shadow-inner-lg'].join(' ')}>
                {props.note.entries.map((entry: GroupType|EntryType, i) => {
                    // Determine if entry is a group, or a regular entry.
                    let isGroup = entry.hasOwnProperty('entries');
                    return isGroup ? (
                        <Group 
                            key={generateUUID()} 
                            group={entry as GroupType} 
                            editable={props.note.editable}
                            index={i} 
                            setEntries={props.setEntries} />
                    ) : (
                        <Entry 
                            key={generateUUID()} 
                            entry={entry as EntryType}
                            editable={props.note.editable}
                            index={[i, 0]}
                            setEntries={props.setEntries} />
                    );
                })}
            </div>
            <div className={['NoteFooter', 'mt-4'].join(' ')}>
                {reduceEntries(props.note.entries) && `Total: ${reduceEntries(props.note.entries)}:-`}
            </div>
            <div className={['NoteDebug', 'mt-8'].join(' ')}>
                <pre className={['text-sm', 'bg-white', 'p-4', 'rounded-lg', 'shadow-inner', 'shadow-inner-lg', 'overflow-scroll'].join(' ')}>
                    {JSON.stringify(props.note, null, 2)}
                </pre>
            </div>
        </div>
    )
} 
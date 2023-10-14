import React, { useState, useEffect, useRef } from 'react';
import { 
    generateUUID, 
    isGroup, 
    hasGroups, 
    reduceEntries,
    reduceGroupEntries
} from "../../utils/helpers";
import { 
    saveNote 
} from "../../utils/store";
import { 
    defaultNote, 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import Group from './Group';
import Entry from './Entry';
import CreateEntrySelection from './CreateEntrySelection';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface NoteProps extends JSX.IntrinsicAttributes {
    note: NoteType;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setEditable: React.Dispatch<React.SetStateAction<boolean>>;
    setEntries: React.Dispatch<React.SetStateAction<(EntryType | GroupType)[]>>;
    load: (note: NoteType) => void,
    reset: () => void;
}

/**
 * Note hook. Required to use a note.
 * @param _note 
 * @returns 
 */
export const useNoteProps = (_note: NoteType = defaultNote()): NoteProps => {
    const [title, setTitle] = useState<string>(_note.title);
    const [updated, setUpdated] = useState<number>(_note.updated);
    const [editable, setEditable] = useState<boolean>(_note.editable);
    const [entries, setEntries] = useState<(EntryType|GroupType)[]>(_note.entries);
    const noteRef = useRef<NoteType>(_note);
    const note = {
        id: noteRef.current.id,
        title: title, 
        created: noteRef.current.created, 
        updated: updated, 
        editable: editable,
        debug: noteRef.current.debug, 
        entries: entries
    };

    useEffect(() => {
        setUpdated(Date.now());
        setTimeout(() => saveNote(note), 0);
    }, [title, editable, entries]);

    const newNote = (note: NoteType|undefined = undefined): void => {
        noteRef.current = note || defaultNote();
        setTitle(noteRef.current.title);
        setUpdated(noteRef.current.updated);
        setEditable(noteRef.current.editable);
        setEntries(noteRef.current.entries);
    };

    return {
        note: note,
        setTitle: setTitle,
        setEditable: setEditable,
        setEntries: setEntries,
        load: (note: NoteType) => newNote(note),
        reset: () => newNote()
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
        <div className={['EditNote', 'w-full', 'text-2xl', 'mb-24', 'md:mb-0', 'text-left'].join(' ')}>
            <div 
                className={['NoteHeader', 'mt-4', 'mb-8'].join(' ')} 
                onClick={props.note.editable ? () => setTitleIsBeingEdited(true) : undefined}>
                {titleIsBeingEdited ? (
                    <input 
                        ref={titleInputRef}
                        type='text' 
                        value={props.note.title} 
                        onChange={(e) => props.setTitle(e.target.value)} 
                        onBlur={() => setTitleIsBeingEdited(false)} />) : (
                    <>
                        {props.note.editable && <EditIcon className="mr-2 inline-block" />}
                        <p className="inline-block">{props.note.title}</p>
                    </>)
                }
            </div>
            <div className={['NoteBody', 'text-xl', 'px-4', 'py-2', 'bg-secondary', 'rounded-lg', 'shadow-inner', 'shadow-inner-lg'].join(' ')}>
                {props.note.entries.map((entry: GroupType|EntryType, i) => {
                    // Determine if entry is a group, or a regular entry.s
                    return isGroup(entry) ? (
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
                {props.note.editable && <CreateEntrySelection index={props.note.entries.length} setEntries={props.setEntries} />}
            </div>
            <div className={['NoteFooter', 'mt-4'].join(' ')}>
                <div className={['inline-block', 'py-2'].join(' ')}>
                    {reduceEntries(props.note.entries) > 0 ? `Total: ${reduceEntries(props.note.entries)}:-` : ''}
                    {hasGroups(props.note.entries) && reduceEntries(props.note.entries) > 0 && (<><br/>{`Total (Groups): ${reduceGroupEntries(props.note.entries)}:-`}</>)}
                </div>
                <span className={['p-1', 'inline', 'float-right', 'rounded-lg', 'shadow-lg', 'bg-highlight'].join(' ')}>
                    {props.note.editable ? 
                        (<DoneIcon fontSize='large' className='text-primary' onClick={() => props.setEditable(oldValue => !oldValue)}/>):
                        (<EditIcon fontSize='large' className='text-primary' onClick={() => props.setEditable(oldValue => !oldValue)}/>)
                    }
                </span>
            </div>
            <div className={['NoteDebug', 'mt-8'].join(' ')}>
                {props.note.debug && (
                    <pre className={['text-sm', 'bg-white', 'p-4', 'rounded-lg', 'shadow-inner', 'shadow-inner-lg', 'overflow-scroll'].join(' ')}>
                        {JSON.stringify(props.note, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    )
} 
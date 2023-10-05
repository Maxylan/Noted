import React, { useState, useEffect, useRef } from 'react';
import { generateUUID, isGroup, hasGroups, reduceEntries } from "../../utils/helpers";
import { 
    defaultNote, 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import Group from './Group';
import Entry from './Entry';
import CreateEntrySelection from './CreateEntrySelection';
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
    }, [title, editable, entries]);

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
        <div className={['EditNote', 'text-2xl', 'mb-24', 'md:mb-0'].join(' ')}>
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
                {reduceEntries(props.note.entries) ? `Total: ${reduceEntries(props.note.entries)}:-` : ''}
                {hasGroups(props.note.entries) && reduceEntries(props.note.entries) && (<><br/>{`Total (Groups): ${reduceEntries(props.note.entries.filter((e: EntryType|GroupType) => isGroup(e)))}:-`}</>)}
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
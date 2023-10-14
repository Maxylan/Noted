import React, { useContext, useState, useEffect, useRef } from 'react';
import Pages from '../../types/pages';
import Modal from "../misc/Modal";
import { 
    hasGroups,
    hasChecked,
    generateUUID, 
    noteFromBEJO,
    argToDate,
    dayName,
    reduceEntries,
    reduceGroupEntries,
    reduceCheckedEntries
} from "../../utils/helpers";
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface ImportProps extends JSX.IntrinsicAttributes {
    load: (note: Note) => void;
    setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
}

/**
 * Import notes by letting the user paste a BEJO-Code. (Base64-Encoded-JSON-Object)
 * @param props 
 * @returns 
 */
export default function Import(props: ImportProps): JSX.Element {
    const [visibilityImportPrompt, setVisibilityImportPrompt] = useState<boolean>(false);
    const [note, setNote] = useState<Note|undefined>();

    useEffect((): any => { // Attempts to read the user's clipboard to see if they have a BEJO-Code copied. Could save some clicks.
        var allowAsynchronousUpdates = true;
        console.log('navigator',  navigator);

        navigator.permissions.query({ 
            name: 'clipboard-read' as PermissionName 
        }).then((status: PermissionStatus): boolean => {

            if (status.state === 'denied') {
                console.log('navigator.permissions.query "result"', status);
                status.onchange = () => {
                    console.log(
                        `clipboard-read permission status has changed to ${status.state}`,
                    );
                };
            }
            
            return status.state === 'granted';
        }).then((authorized: boolean) => {
            console.log('Authorized to access clipboard?',  authorized);

            if (authorized && navigator.clipboard) {
                navigator.clipboard.readText().then((_clipText) => {
                    if (allowAsynchronousUpdates) {
                        // Parse bejo.
                        let _note = noteFromBEJO(_clipText);
                        if (_note) {
                            setNote(_note);
                            setVisibilityImportPrompt(true);
                        }
                    }
                })
            }
            /*
            else {
                // Parse bejo. (test)
                let _note = noteFromBEJO('paste bejo here');
                if (_note) {
                    setNote(_note);
                    setVisibilityImportPrompt(true);
                }
            }
            */
        });

        return () => allowAsynchronousUpdates = false;
    }, []);

    const editNote = (_note: Note) => {
        _note.editable = true;
        props.load(_note); 
        props.setCurrentPage(Pages.NewNote);
    }

    return (
        <div className={['Import'].join(' ')}>

            <Modal visible={visibilityImportPrompt} setVisibility={setVisibilityImportPrompt}>
                {note && 
                <div className={['ImportPrompt', 'text-lg'].join(' ')}>
                    <p>Found note!</p>
                    <p>{`(${note.title})`}</p>
                    
                    <div className={['NoteDetails', 'my-2'].join(' ')}>
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
                    <div className='w-full'>
                        <button className={['float-right', 'pl-4', 'pb-2', 'pt-[0.25rem]', 'pr-2', 'bg-highlight', 'rounded-md', 'shadow-md', 'hover:shadow-lg'].join(' ')} onClick={() => editNote(note)}>
                            <span className={['inline-block', 'align-middle'].join(' ')}>Import!</span>
                            <span className={['inline-block', 'align-middle'].join(' ')}><KeyboardArrowRightIcon /></span>
                        </button>
                    </div>
                </div>
                }
            </Modal>
        </div>
    );
}
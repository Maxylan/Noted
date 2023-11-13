import React, { useState, useEffect, useRef } from 'react';
import { generateUUID, reduceEntries } from "../../utils/helpers";
import { 
    Note as NoteType, 
    Group as GroupType, 
    Entry as EntryType 
} from '../../types/Notes';
import Entry from './Entry';
import CreateEntrySelection from './CreateEntrySelection';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


export interface GroupProps extends JSX.IntrinsicAttributes {
    /**
     * The group.
     */
    group: GroupType;
    /**
     * Is editable? / Enable edit-related functionality.
     */
    editable: boolean;
    /**
     * Position in Note.entries
     */
    index: number;
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
export default function Group({group, editable, index, setEntries}: GroupProps): JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(true);
    const [titleIsBeingEdited, setTitleIsBeingEdited] = useState<boolean>(false);
    const [showDeleteGroupPrompt, setDeleteGroupPromptVisible] = useState<boolean>(false);
    const hidePrompt = () => setDeleteGroupPromptVisible(false),
          showPrompt = () => setDeleteGroupPromptVisible(true);
    const titleInputRef = useRef<any>();

    useEffect(() => {
        if (titleIsBeingEdited) { titleInputRef.current?.focus(); }
    }, [titleIsBeingEdited]);

    const updateEntry = (key: keyof GroupType, value: any) => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];
            let group = oldEntriesCopy[index];
            ((group as GroupType)[key] as any) = value; // What??
            return oldEntriesCopy;
        });
    }

    return (
        <div className={['GroupBody', 'text-xl', 'my-2', 'p-2', 'rounded-lg', 'shadow-sm'].join(' ')} style={{backgroundColor: group.color}}>
            <div className={['w-full', 'text-2xl', 'flex'].join(' ')}>
                <span onClick={editable ? () => setTitleIsBeingEdited(true) : undefined}>
                    {titleIsBeingEdited ? (
                        <input 
                            ref={titleInputRef}
                            type='text' 
                            maxLength={48}
                            defaultValue={group.title} 
                            onBlur={(e) => {
                                updateEntry('title', e.target.value);
                                setTitleIsBeingEdited(false);
                            }} />) : (
                        <>
                            <div className={['inline-block', 'flex-auto', 'max-w-[16rem]'].join(' ')}>{ group.title }</div>
                        </>)
                    }
                </span>
                <span 
                    className={['flex-none', 'ml-auto', 'mr-2'].join(' ')}
                    onClick={() => setExpanded(old => !old)}>
                    {expanded ? 
                        (<ExpandLessIcon />): 
                        (<ExpandMoreIcon />)}
                </span>
            </div>
            <div className={['my-2'].join(' ')}>
                {expanded && (<>{
                    group.entries?.map((entry, i) => {
                        return (
                            <Entry 
                                key={generateUUID()}
                                editable={editable} 
                                entry={entry} 
                                index={[index, i]} 
                                setEntries={setEntries} />
                        )
                    })}   
                    {editable && <CreateEntrySelection index={[index, group.entries.length]} setEntries={setEntries} />}
                </>)}
            </div>
            <div className={['w-full', 'border-highlight', 'border-t-[1px]'].join(' ')}>
                {`${reduceEntries(group.entries)}:-`}
                {editable && <>
                    <DeleteIcon className={['float-right', 'mr-2', 'mt-[4px]', 'text-scrap'].join(' ')} onClick={() => {
                        if (group.entries.length > 0) {
                            showPrompt();
                        } else {
                            setEntries(oldEntries => {
                                let oldEntriesCopy = [...oldEntries];
                                oldEntriesCopy.splice(index, 1);
                                return oldEntriesCopy;
                            });
                            hidePrompt();
                        }
                    }}/>
                    {showDeleteGroupPrompt && <DeleteGroupPrompt hide={hidePrompt} groupIndex={index} setEntries={setEntries} />}
                </>}
            </div>
        </div>
    )
} 

const DeleteGroupPrompt = function ({hide, groupIndex, setEntries} : {
    hide: () => void, 
    groupIndex: number, 
    setEntries: React.Dispatch<React.SetStateAction<(EntryType | GroupType)[]>>
}): JSX.Element {
    const deleteAll = () => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];
            oldEntriesCopy.splice(groupIndex, 1);
            return oldEntriesCopy;
        });
        hide();
    };
    const deleteGroup = () => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];
            let groupToBeDeleted = oldEntriesCopy.splice(groupIndex, 1) as GroupType[];
            // Insert `groupToBeDeleted.entries` into `oldEntriesCopy` at `groupIndex`.
            oldEntriesCopy.splice(groupIndex, 0, ...groupToBeDeleted[0].entries);
            return oldEntriesCopy;
        });
        hide();
    };
    const cancel = (e: any) => {
        e.stopPropagation();
        if (['Cancel', 'DeleteGroupPrompt'].includes(e.target.className.split(' ')[0])) {
            hide();
        }
    }
    
    // Make a modal
    return (
        <div className={['DeleteGroupPrompt', 'w-full', 'h-full', 'fixed', 'top-0', 'left-0', 'flex', 'justify-center', 'items-center', 'bg-opacity-50', 'bg-gray-800'].join(' ')} onClick={cancel}>
            <div className={['p-8', 'm-4', 'flex', 'flex-col', 'justify-center', 'items-center', 'bg-primary', 'rounded-lg', 'shadow-lg'].join(' ')} onClick={undefined}>
                <div className={['w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'items-center', 'text-center'].join(' ')}>
                    <span className={['text-2xl', 'font-bold', 'mb-4'].join(' ')}>Delete Group</span>
                    <span className={['text-xl', 'mb-4'].join(' ')}>Are you sure you want to delete this group?</span>
                    <div className={['w-full', 'flex', 'justify-center', 'items-center'].join(' ')}>
                        <button className={['w-1/2', 'h-12', 'rounded-lg', 'bg-highlight', 'shadow-md', 'hover:shadow-lg', 'mr-2'].join(' ')} onClick={() => deleteAll()}>Delete All</button>
                        <button className={['w-1/2', 'h-12', 'rounded-lg', 'bg-highlight', 'shadow-md', 'hover:shadow-lg', 'ml-2'].join(' ')} onClick={() => deleteGroup()}>Delete Group</button>
                    </div>
                    <button className={['Cancel', 'w-1/2', 'h-12', 'rounded-lg', 'bg-secondary', 'shadow-md', 'hover:shadow-lg', 'mt-4'].join(' ')} onClick={cancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
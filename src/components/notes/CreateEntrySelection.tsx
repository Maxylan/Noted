import React, { useContext, useState, useEffect, useRef } from 'react';
import { useAuthorization } from '../../features/Authorization/Authorization';
import { isGroup } from "../../utils/helpers";
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
import TitleIcon from '@mui/icons-material/Title';
import ChecklistIcon from '@mui/icons-material/Checklist';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

/**
 * Selection of buttons that allows you to create an entry!
 * @param props 
 * @returns 
 */
export default function CreateEntrySelection({index, setEntries}: {
    index: number|[number, number], 
    setEntries: React.Dispatch<React.SetStateAction<(Entry|Group)[]>>}
): JSX.Element {
    const authorizationStatus = useAuthorization();
    const isSelectionInGroup = (): boolean => Array.isArray(index);
    const newEntry = (checkbox: boolean = false): Entry => {
        return (checkbox ? {
            title: 'New Entry',
            checked: false
        } : {
            title: 'New Entry'
        }) as Entry
    };
    const newGroup = (): Group => ({
        title: 'New Group',
        image: undefined,
        color: 'rgb(255, 197, 167)',
        entries: [],
    })
    const createEntry = (type: 'text'|'checklist'|'group') => {
        setEntries(oldEntries => {
            let oldEntriesCopy = [...oldEntries];

            if (isSelectionInGroup()) {
                index = index as [number, number];
                // Apparently, React Strict Mode made the app fire twice, and that meant this created two entries.
                // Didn't create two entries when !isSelectionInGroup() though! Weird!
                // Had to turn off Strict Mode to fix this.
                (oldEntriesCopy[index[0]] as Group).entries.push((type === 'text' ? newEntry() : newEntry(true)));
            }
            else if (!isSelectionInGroup()) {
                oldEntriesCopy.push((() => { switch(type) {
                    case 'text': return newEntry();
                    case 'checklist': return newEntry(true);
                    case 'group': return newGroup();
                }})());
            }
            
            return oldEntriesCopy;
        });
    }

    useEffect(() => {
    }, []);

    return (
        <div className={['CreateEntrySelection'].join(' ')}>
            <span 
                onClick={() => createEntry('text')}
                className={['inline-block', 'w-fit', 'h-fit', 'my-2.5', 'mr-2.5', 'px-2', 'pb-1', 'cursor-pointer', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight', (isSelectionInGroup() ? 'bg-highlight':'bg-third')].join(' ')}>
                <TitleIcon className={'text-primary'}/>
            </span>
            <span 
                onClick={() => createEntry('checklist')}
                className={['inline-block', 'w-fit', 'h-fit', 'm-2.5', 'px-2', 'pb-1', 'cursor-pointer', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight', (isSelectionInGroup() ? 'bg-highlight':'bg-third')].join(' ')}>
                <ChecklistIcon className={'text-primary'}/>
            </span>
            {!isSelectionInGroup() && 
                <span 
                    onClick={() => createEntry('group')}
                    className={['bg-third', 'inline-block', 'w-fit', 'h-fit', 'm-2.5', 'px-2', 'pb-1', 'cursor-pointer', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight'].join(' ')}>
                    <AddIcon className={['text-primary'].join(' ')}/>
                </span>
            }
        </div>
    )
} 
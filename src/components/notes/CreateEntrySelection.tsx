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

    useEffect(() => {
    }, []);

    return (
        <div className={['CreateEntrySelection'].join(' ')}>
            <div 
                className={['bg-transparent', 'inline-block', 'w-fit', 'h-fit', 'my-2', 'mr-2', 'px-2', 'pb-1', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight'].join(' ')}>
                <TitleIcon className={['text-highlight'].join(' ')}/>
            </div>
            <div 
                className={['bg-transparent', 'inline-block', 'w-fit', 'h-fit', 'm-2', 'px-2', 'pb-1', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight'].join(' ')}>
                <ChecklistIcon className={['text-highlight'].join(' ')}/>
            </div>
            {!Array.isArray(index) && 
                <div 
                    className={['bg-transparent', 'inline-block', 'w-fit', 'h-fit', 'm-2', 'px-2', 'pb-1', 'shadow-md', 'hover:shadow-lg', 'rounded-md', 'border-2', 'border-highlight'].join(' ')}>
                    <AddIcon className={['text-highlight'].join(' ')}/>
                </div>
            }
        </div>
    )
} 
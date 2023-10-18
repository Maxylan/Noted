import React, { useContext, useState, useEffect } from 'react';
import { 
    date,
    dayName,
    argToDate,
    dateKey, 
    getMonthName,
    generateUUID
} from "../../utils/helpers";
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
import HouseIcon from '@mui/icons-material/House';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


/**
 * Settings page, allowing you to change application-wide settings.
 * @param props 
 * @returns 
 */
export default function Settings(): JSX.Element {
    useEffect(() => {
    }, []);

    return (
        <>
            <div className={['Settings', 'text-center'].join(' ')}>
                TBA!
            </div>
        </>
    )
} 
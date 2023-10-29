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
import Settings from '../../features/settings';
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
export default function SettingsPage(): JSX.Element {
    useEffect(() => {
    }, []);

    return (
        <>
            <div className={['Settings', 'w-full', 'text-text', 'text-left'].join(' ')}>
                <div className={['General'].join(' ')}>
                    <div className={['text-2xl'].join(' ')}>General</div>
                    <div className={['w-full', 'mt-2', 'text-xl', 'flex', 'bg-secondary', 'shadow-sm', 'rounded-lg'].join(' ')}>
                        <div className={['m-2', 'flex-1', 'border-text'].join(' ')}>
                            <span>Enable debug mode:</span>
                        </div>
                        <input 
                            type={'checkbox'} 
                            className={['m-2', 'ml-auto', 'border-text'].join(' ')}
                            defaultChecked={Settings.debugEnabled()}
                            onChange={(r) => Settings.debugEnabled(r.target.checked)}/>
                    </div>
                    <div className={['w-full', 'mt-2', 'text-xl', 'flex', 'bg-secondary', 'shadow-sm', 'rounded-lg'].join(' ')}>
                        <div className={['m-2', 'flex-1', 'border-text'].join(' ')}>
                            <span>Show images:</span>
                        </div>
                        <input 
                            type={'checkbox'} 
                            className={['m-2', 'ml-auto', 'border-text'].join(' ')} 
                            defaultChecked={Settings.showImages()}
                            onChange={(r) => Settings.showImages(r.target.checked)}/>
                    </div>
                </div>
            </div>
        </>
    )
} 
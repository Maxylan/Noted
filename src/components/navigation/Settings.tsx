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
    const [cityRequiresReloadNotice, setCityRequiresReloadNotice] = useState<boolean>(false);

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
                            onChange={(e) => Settings.debugEnabled(e.target.checked)}/>
                    </div>
                    <div className={['w-full', 'mt-2', 'text-xl', 'flex', 'bg-secondary', 'shadow-sm', 'rounded-lg'].join(' ')}>
                        <div className={['m-2', 'flex-1', 'border-text'].join(' ')}>
                            <span>City:</span>
                        </div>
                        <input 
                            type={'text'} 
                            className={['m-2', 'ml-auto', 'border-text'].join(' ')} 
                            defaultValue={Settings.city()}
                            onChange={(e) => {
                                if (!cityRequiresReloadNotice) {
                                    setCityRequiresReloadNotice(true);
                                }
                                Settings.city(e.target.value);
                            }}/>
                    </div>
                    {cityRequiresReloadNotice && (
                        <div className={['bg-third', 'w-3/4', 'px-2', 'my-2', 'mx-auto', 'rounded-md', 'shadow-sm'].join(' ')}>
                            <span className={['text-highlight', 'text-base'].join(' ')}>Changing cities requires a page reload to have an effect.</span>
                        </div>
                    )}
                    <div className={['w-full', 'mt-2', 'text-xl', 'flex', 'bg-secondary', 'shadow-sm', 'rounded-lg'].join(' ')}>
                        <div className={['m-2', 'flex-1', 'border-text'].join(' ')}>
                            <span>Show images:</span>
                        </div>
                        <input 
                            type={'checkbox'} 
                            className={['m-2', 'ml-auto', 'border-text'].join(' ')} 
                            defaultChecked={Settings.showImages()}
                            onChange={(e) => Settings.showImages(e.target.checked)}/>
                    </div>
                </div>
            </div>
        </>
    )
} 
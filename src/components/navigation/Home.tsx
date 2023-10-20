import React from 'react';
import Pages from '../../types/pages';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotesIcon from '@mui/icons-material/Notes';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuthorization } from '../../features/api/HttpWrapper';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

const buttonClasses = ['w-full', 'h-fit', 'my-4', 'py-4', 'px-2', 'text-2xl', 'rounded-md', 'bg-secondary', 'shadow-md', 'hover:shadow-lg', 'md:cursor-pointer'].join(' ');

export default function Home(props: any): JSX.Element {
    const status = useAuthorization();
    return (
        <div className={['Home', 'max-w-xs', 'h-full', 'flex', 'flex-col', 'justify-center'].join(' ')}>
            {status.health === 'healthy' ? (
                <a href={`${Staffanshopper.grossconfig.HOST}${status.store.url}`} target='_blank' rel='noreferrer'>
                    <img 
                        className={['max-h-80', 'rounded-lg', 'shadow-md', 'my-8'].join(' ')}
                        src={`${Staffanshopper.grossconfig.HOST}${status.store.mobileImage.url}`} 
                        alt={`Staffanshopper (${status.store.address.city})`} />
                </a>
            ) : (
                <img 
                    className={['max-h-80', 'rounded-lg', 'shadow-md', 'my-8'].join(' ')}
                    src='https://placehold.co/600x400' 
                    alt='Staffanshopper' />
            )}
            
            {props.note.entries.length > 0 && 
                <div onClick={() => props.setCurrentPage(Pages.EditNote)} className={buttonClasses}>
                    <EditIcon fontSize='large' className={'float-left'}/>
                    <span>{Pages.Continue}</span>
                    <br/>
                    <span className={['text-highlight', 'text-base'].join(' ')}>{props.note.title}</span>
                </div>
            }
            <div onClick={() => { props.resetCurrentNote(); props.setCurrentPage(Pages.EditNote); }} className={buttonClasses}>
                <ReceiptLongIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.EditNote}</span>
            </div>
            <div onClick={() => props.setCurrentPage(Pages.Notes)} className={buttonClasses}>
                <NotesIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.Notes}</span>
            </div>
            <div onClick={(e) => { props.setCurrentPage(Pages.Import); console.log('e.isTrusted (For clipboard access)',  e.isTrusted); }} className={buttonClasses}>
                <DownloadIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.Import}</span>
            </div>
            <div onClick={() => props.setCurrentPage(Pages.Settings)} className={buttonClasses}>
                <SettingsIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.Settings}</span>
            </div>
        </div>
    );
}
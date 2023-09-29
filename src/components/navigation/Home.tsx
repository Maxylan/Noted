import React from 'react';
import Pages from '../../types/pages';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotesIcon from '@mui/icons-material/Notes';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SettingsIcon from '@mui/icons-material/Settings';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

const buttonClasses = ['w-full', 'h-fit', 'my-4', 'py-4', 'px-2', 'text-2xl', 'rounded-md', 'bg-secondary', 'shadow-md', 'hover:shadow-lg', 'md:cursor-pointer'].join(' ');

export default function Home(props: any): JSX.Element {
    return (
        <div className={['Home', 'w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'align-center', 'items-center', 'text-center'].join(' ')}>
            <img 
                className={['max-w-xs', 'max-h-80', 'rounded-lg', 'shadow-md', 'my-8', 'md:mx-8'].join(' ')}
                src={'https://placehold.co/600x400'} 
                alt='Staffanshopper' />
            <div onClick={() => props.setCurrentPage(Pages.NewNote)} className={buttonClasses}>
                <ReceiptLongIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.NewNote}</span>
            </div>
            <div onClick={() => props.setCurrentPage(Pages.Notes)} className={buttonClasses}>
                <NotesIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.Notes}</span>
            </div>
            <div onClick={() => props.setCurrentPage(Pages.About)} className={buttonClasses}>
                <QuestionMarkIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.About}</span>
            </div>
            <div onClick={() => props.setCurrentPage(Pages.Settings)} className={buttonClasses}>
                <SettingsIcon fontSize='large' className={'float-left'}/>
                <span>{Pages.Settings}</span>
            </div>
        </div>
    );
}
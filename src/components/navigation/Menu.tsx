import React, { useContext, useState, useEffect } from 'react';
import Note, { useNoteProps } from '../notes/Note';
import ListNotes from '../notes/ListNotes';
import Pages from '../../types/pages';
import Home from './Home';
import HouseIcon from '@mui/icons-material/House';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


/**
 * Main Menu of the application.
 * @param props 
 * @returns 
 */
export default function Menu(): JSX.Element {
    const [currentPage, setCurrentPage] = useState<Pages>(Pages.Home);
    const note = useNoteProps();

    useEffect(() => {
    }, []);

    return (
        <>
            <div className={['Menu', 'relative', 'p-4', 'flex', 'w-full', 'md:w-[640px]', 'md:h-fit', 'm-auto', 'md:shadow-lg', 'md:rounded', 'justify-center', 'align-center', 'items-center', 'text-center'].join(' ')}>
                {((page) => {
                    switch(page) {
                        case Pages.NewNote: return (
                            <Note {...note}/>
                        );
                        case Pages.Notes: return (
                            <ListNotes 
                                load={note.load} 
                                setCurrentPage={setCurrentPage}/>
                        );
                        case Pages.About: return (
                            <></>
                        );
                        default: return (
                            <Home currentPage={currentPage} 
                                setCurrentPage={setCurrentPage} 
                                resetCurrentNote={note.reset} 
                                note={note.note}/>
                        );
                    }
                })(currentPage)}
                {currentPage === Pages.Home|| (
                    <span
                        onClick={() => setCurrentPage(Pages.Home)}
                        className={(window.innerWidth < 768 ? 'bottom-4 left-4' : 'top-4 right-4') + ' ' + ['fixed', 'p-4', 'rounded-full', 'shadow-lg', 'bg-third'].join(' ')}>
                        <HouseIcon fontSize='large' className='text-primary'/>
                    </span>
                )}
            </div>
        </>
    )
} 
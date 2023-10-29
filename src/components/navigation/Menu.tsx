import React, { useContext, useState, useEffect } from 'react';
import Note, { useNoteProps } from '../notes/Note';
import ListNotes from '../notes/ListNotes';
import Import from '../notes/Import';
import Settings from './Settings';
import Pages from '../../types/pages';
import Home from './Home';
import HouseIcon from '@mui/icons-material/House';
import NotesIcon from '@mui/icons-material/Notes';
import AddIcon from '@mui/icons-material/Add';
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
            <div className={['Menu', 'bg-primary', 'relative', 'p-4', 'flex', 'w-full'/*, 'h-full'*/, 'overflow-auto', 'md:w-[640px]'/*, 'md:h-fit'*/, 'h-fit', 'm-auto', 'md:shadow-lg', 'md:rounded', 'justify-center', 'align-center', 'items-center', 'text-center'].join(' ')}>
                {((page) => {
                    switch(page) {
                        case Pages.EditNote: return (
                            <Note {...note}/>
                        );
                        case Pages.Notes: return (
                            <ListNotes 
                                load={note.load} 
                                resetCurrentNote={note.reset} 
                                setCurrentPage={setCurrentPage}/>
                        );
                        case Pages.Import: return (
                            <Import 
                                load={note.load} 
                                setCurrentPage={setCurrentPage}/>
                        );
                        case Pages.Settings: return (
                            <Settings />
                        );
                        default: return (
                            <Home currentPage={currentPage} 
                                setCurrentPage={setCurrentPage} 
                                resetCurrentNote={note.reset} 
                                note={note.note}/>
                        );
                    }
                })(currentPage)}
                {currentPage === Pages.Home || (
                    <>
                        <div
                            onClick={() => setCurrentPage(Pages.Home)}
                            className={(window.innerWidth < 768 ? 'bottom-4 left-4' : 'top-4 right-4') + ' ' + ['fixed', 'p-4', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'bg-highlight', 'cursor-pointer'].join(' ')}>
                            <HouseIcon fontSize='large' className='text-primary'/>
                        </div>
                        {currentPage !== Pages.Notes && 
                            <div
                                onClick={() => setCurrentPage(Pages.Notes)}
                                className={(window.innerWidth < 768 ? 'bottom-4 left-24' : 'top-24 right-4') + ' ' + ['fixed', 'p-4', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'bg-highlight', 'cursor-pointer'].join(' ')}>
                                <NotesIcon fontSize='large' className='text-primary'/>
                            </div>
                        }
                        {currentPage === Pages.Notes && 
                            <div
                                onClick={() => { note.reset(); setCurrentPage(Pages.EditNote); }}
                                className={(window.innerWidth < 768 ? 'bottom-4 left-24' : 'top-24 right-4') + ' ' + ['fixed', 'p-4', 'rounded-full', 'shadow-md', 'hover:shadow-lg', 'bg-highlight', 'cursor-pointer'].join(' ')}>
                                <AddIcon fontSize='large' className='text-primary'/>
                            </div>
                        }
                    </>
                )}
            </div>
        </>
    )
} 
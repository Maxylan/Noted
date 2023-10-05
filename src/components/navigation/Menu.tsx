import React, { useContext, useState, useEffect } from 'react';
import Note, { useNoteProps } from '../notes/Note';
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
    const newNoteProps = useNoteProps();

    useEffect(() => {
    }, []);

    return (
        <>
            <div className={['Menu', 'relative', 'w-screen', 'h-screen', 'p-4', 'flex-block', 'md:w-fit', 'md:h-fit', 'm-auto', 'md:shadow-lg', 'md:rounded'].join(' ')}>
                {((page) => {
                    switch(page) {
                        case Pages.NewNote: return (<Note {...newNoteProps}/>);
                        case Pages.Notes: return (<></>);
                        case Pages.About: return (<></>);
                        default: return (<Home currentPage={currentPage} setCurrentPage={setCurrentPage} />);
                    }
                })(currentPage)}
                {currentPage === Pages.Home|| (
                    <span
                        onClick={() => setCurrentPage(Pages.Home)}
                        className={['absolute', 'bottom-4', 'left-4', 'p-4', 'rounded-full', 'shadow-lg', 'bg-third'].join(' ')}>
                        <HouseIcon fontSize='large' className='text-primary'/>
                    </span>
                )}
            </div>
        </>
    )
} 
import React, { useState, useEffect, useRef } from 'react';
import { 
    Note, 
    Group, 
    Entry 
} from '../../types/Notes';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

export interface ModalProps extends React.HTMLProps<HTMLElement> { 
    visible: boolean, 
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>; 
}

export default function Modal(props: ModalProps): JSX.Element {
    // Make a modal
    return (
        <div className={['DeleteGroupPrompt', 'w-full', 'h-full', 'fixed', 'top-0', 'left-0', 'flex', 'justify-center', 'items-center', 'bg-opacity-50', 'bg-gray-800'].join(' ')} 
            style={{display: props.visible ? 'initial' : 'none'}} 
            onClick={(e) => { 
                e.stopPropagation(); 
                props.setVisibility(false); 
            }}>
            <div className={['p-8', 'm-4', 'flex', 'flex-col', 'justify-center', 'items-center', 'bg-primary', 'rounded-lg', 'shadow-lg'].join(' ')} onClick={undefined}>
                <div className={['w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'items-center', 'text-center'].join(' ')} onClick={undefined}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}
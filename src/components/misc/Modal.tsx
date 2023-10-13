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
        <div className={['Modal', 'w-full', 'h-full', 'fixed', 'top-0', 'left-0', 'justify-center', 'items-center', 'bg-opacity-50', 'bg-gray-800'].join(' ')} 
            style={{display: props.visible ? 'initial' : 'none'}} 
            onClick={(e) => { 
                // Why doesn't this do anything. Have I missunderstud what stopPropagation does?
                e.stopPropagation(); 

                /** Begin stupid 💩 */
                const target = (e.target as any); 
                let className = typeof target.className === 'object' ? target.className.baseVal : target.className;
                // console.log(className);
                /** End stupid 💩 */

                if (className.includes('Modal')) {
                    props.setVisibility(false);
                }
            }}>
            <div className={['Modal', 'w-full', 'h-full', 'flex', 'justify-center', 'items-center'].join(' ')} onClick={undefined}>
                <div className={['p-6', 'm-4', 'md:max-w-lg', 'h-fit', 'flex', 'flex-col', 'bg-primary', 'rounded-lg', 'shadow-lg'].join(' ')} onClick={undefined}>
                    <div className={['w-full', 'h-full', 'flex', 'flex-col'].join(' ')} onClick={undefined}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}
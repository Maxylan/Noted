import React, { useEffect, useState } from 'react';
// import './scss/main.scss';
import './scss/tailwind.css';
import HttpWrapper from './features/api/HttpWrapper';
import Menu from './components/navigation/Menu';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

/**
 * Main app class/(component).
 * @returns 
 */
function App() {

  useEffect(() => {
    console.log('Noted (Max Olsson)');
    // console.log('app.grossconfig (Extended window object working)', app.grossconfig);
    // console.log('app.noted (Extended window object working)', app.noted);
  }, []);

  return (
    <div className={['Noted', 'w-screen', 'h-screen', 'text-text', 'flex', 'align-center', 'justify-center'].join(' ')}>
      <HttpWrapper>
        <Menu />
      </HttpWrapper>
      <p className={['Credit', 'fixed', 'bottom-0', 'right-8', 'text-[rgba(128,128,128,0.75)]', 'text-sm', 'italic'].join(' ')}>
          By <a href='https://github.com/Maxylan' target='_blank' rel='noreferrer'>Maxylan</a>
      </p>
    </div>
  );
}

export default App;

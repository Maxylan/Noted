import React, { useEffect, useState } from 'react';
// import './scss/main.scss';
import './scss/tailwind.css';
import Authorization from './features/Authorization/Authorization';
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
    console.log('Staffanshopper (Max Olsson)');
    // console.log('Staffanshopper.grossconfig (Extended window object working)', Staffanshopper.grossconfig);
  }, []);

  return (
    <div className={['Staffanshopper', 'w-screen', 'h-screen', 'text-text', 'flex', 'align-center', 'justify-center'].join(' ')}>
      <Authorization>
        <Menu />
      </Authorization>
    </div>
  );
}

export default App;

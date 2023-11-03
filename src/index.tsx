import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './features/reportWebVitals';
import App from './App';
import { 
  GrossConfig, 
  StaffansConfig 
} from './configs/config';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */

// Create the Noted global and assign the extended window object to it.
declare global {
  interface WindowExtended extends Window {
    readonly grossconfig: GrossConfig;
    readonly staffansconfig: StaffansConfig;
  }

  var app: WindowExtended;
}
global.app = window as any;
console.log(app);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
/* Strict
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

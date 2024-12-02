import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import ClubsManagerApp from './ClubsManagerApp/ClubsManagerApp';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClubsManagerApp />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Do users have all the information they need to make actions
// Are user sforced to memorize everything
// Do users have shortcuts that speed things up for experts
// Can newbies easily learn the system  with no idea whats going on
// Are you using real world language, icons, and metaphors
// Do you have consistent design across all components
// Do you follow website standards
// Is any pages or components clutterd, is there any irrelevant info, is it too much at once
// When theres an error do users understand it and have options to recover
// Do you provide help or documentation to help users complete tasks
// Do users have the ability to undo
// Are users prevented from making errors
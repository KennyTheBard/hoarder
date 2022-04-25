import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MantineProvider } from '@mantine/core';
window.React = React

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider theme={{ fontFamily: 'Open Sans' }}>
      <App />
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


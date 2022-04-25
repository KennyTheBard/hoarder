import { AppShell, Navbar, Header, Aside, Container } from '@mantine/core';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import './App.css';
import { Home } from './features/home/Home';


export default class App extends React.Component {

  render() {
    return (
      <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
      </div>
    );
  }
}


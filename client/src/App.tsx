import { AppShell, Header } from '@mantine/core';
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import './App.css';
import { AppHeader } from './components/header/AppHeader';
import { Home } from './features/home/Home';
import { TagList } from './features/tag-list/TagList';
import { store } from './redux/store';


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <div className="background"></div>
        <div className="App">
          <Router>
            <AppShell
              padding="md"
              header={<AppHeader />}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tags" element={<TagList />} />
              </Routes>
            </AppShell>
          </Router>
        </div>
      </Provider>
    );
  }
}


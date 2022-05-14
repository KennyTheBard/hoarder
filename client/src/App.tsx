import { AppShell } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { AppHeader } from './components/header/AppHeader';
import { Home } from './features/home/Home';
import { TagList } from './features/tag-list/TagList';
import { store } from './redux/store';
import { NotificationsProvider } from '@mantine/notifications';
import './App.css';

export default function App() {

  return (
    <Provider store={store}>
      <NotificationsProvider>
        <ModalsProvider>
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
        </ModalsProvider>
      </NotificationsProvider>
    </Provider>
  );

}


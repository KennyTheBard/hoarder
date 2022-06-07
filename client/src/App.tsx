import { AppShell } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';
import { BookmarkList } from './features/bookmark-list/BookmarkList';
import { TagList } from './features/tag-list/TagList';
import { store } from './redux/store';
import { NotificationsProvider } from '@mantine/notifications';
import { AppHeader, PinDialog } from './components';
import './App.css';
import { DataTool } from './features/data-tool/DataTool';

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
                  <Route path="/" element={<BookmarkList />} />
                  <Route path="/tags" element={<TagList />} />
                  <Route path="/archive" element={<BookmarkList isArchive={true}/>} />
                  <Route path="/data-tool" element={<DataTool />} />
                </Routes>
              </AppShell>
            </Router>
          </div>
          <PinDialog />
        </ModalsProvider>
      </NotificationsProvider>
    </Provider>
  );

}


import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import './App.css';
import { Home } from './features/home/Home';
import { store } from './redux/store';


export default class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <div className="background"></div>
        <div className="App">
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </div>
      </Provider>
    );
  }
}


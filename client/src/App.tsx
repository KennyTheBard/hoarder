import React from 'react';
import Helmet from 'react-helmet';
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom';

import './App.css';


export default class App extends React.Component {

  state: {
    alerts: string[],
  } = {
      alerts: []
    }

  constructor(props: any) {
    super(props);

    this.addAlert = this.addAlert.bind(this);
  }


  addAlert(message: string) {
    this.setState({
      alerts: [
        ...this.state.alerts,
        message
      ]
    });
    setTimeout(() => {
      this.setState({ alerts: [...this.state.alerts].slice(1) });
    },
      3000
    );
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>Hoarder</title>
        </Helmet>
      </div>
    );
  }
}


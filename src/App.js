import React from 'react';
import Home from './components/Home';
import Game from './components/Game';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';

const domain = "ws://127.0.0.1:8000";
export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/home" render={() => <Home domain={domain} />} />
            <Route path="/game/:code" render={() => <Game domain={domain} />} />
            <Redirect path="*" to="/home" />
          </Switch>
        </Router>
      </div>
    );
  }
}


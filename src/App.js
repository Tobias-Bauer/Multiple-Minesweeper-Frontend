import React from 'react';
import Home from './components/Home';
import Game from './components/Game';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';

const domain = "https://multiplayersweeper.herokuapp.com";
const wsdomain = "wss://multiplayersweeper.herokuapp.com";
export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/home" render={() => <Home domain={domain} />} />
            <Route path="/game/:code/:name" render={() => <Game domain={domain} wsdomain={wsdomain} />} />
            <Redirect path="*" to="/home" />
          </Switch>
        </Router>
      </div>
    );
  }
}


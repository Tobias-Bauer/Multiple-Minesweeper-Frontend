import React from 'react';
import Home from './components/Home';
import Game from './components/Game';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <div className="App">
        <Router>
          <Switch>
              <Route path="/home" render={() => <Home/>} />
              <Route path="/game/:id" render={() => <Game/>} />
              <Redirect path="*" to="/home"/>
          </Switch>
        </Router>
    </div>
  );
}

export default App;

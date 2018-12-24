import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.css';

import Order from './pages/Order.js'
import Login from './pages/Login.js'
import OrderHistory from './pages/OrderHistory.js'
import Search from './pages/Search.js'

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Login}/>
          <Route exact path='/orders' component={Order}/>
          <Route exact path='/order-history' component={OrderHistory}/>
          <Route exact path='/search' component={Search}/>
        </div>
      </Router>
    )
  }
};

export default App;

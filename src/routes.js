import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

class PrivateRoute extends React.Component {
  estaAutenticado = () => {
    return localStorage.getItem('TOKEN');
  }

  render() {
    const { component: Component, ...props } = this.props;

    if(this.estaAutenticado()) {
      return <Component {...props} />
    }

    return <Redirect to="/login" />
  }
}

class Roteamento extends React.Component {
  render() {
    return (
      <Switch>
        <PrivateRoute path="/" component={HomePage} exact />
        <Route path="/login" component={LoginPage} />
      </Switch>
    )
  }
}

export default Roteamento;
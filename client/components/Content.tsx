import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Login } from './Login';
import { ProtectedRoute } from './ProtectedRoute';

import { Home } from './Home';
import { About } from './About/About';
import { MongoDb } from './MongoDb/MongoDb';
import { Topics } from './Topics';
import { NoMatch } from './NoMatch';
import { User } from './User/User';

export function Content() {
  return (
    <div id="content">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/mongodb" component={MongoDb} />
        <ProtectedRoute exact path="/about" component={About} />
        <ProtectedRoute exact path="/topics" component={Topics} />
        <Route exact path="/login" component={Login} />
        <ProtectedRoute path="/user" component={User} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

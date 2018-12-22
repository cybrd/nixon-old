import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Create } from './Create';

export function User() {
  return (
    <React.Fragment>
      <h3>User</h3>
      <Switch>
        <Route exact path="/user" component={List} />
        <Route exact path="/user/create" component={Create} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

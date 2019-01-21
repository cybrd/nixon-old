import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Create } from './Create';
import { Edit } from './Edit';
import { Load } from './Load';

export function Employee() {
  return (
    <React.Fragment>
      <h3>Employee</h3>
      <Switch>
        <Route exact path="/employee" component={List} />
        <Route exact path="/employee/create" component={Create} />
        <Route exact path="/employee/load" component={Load} />
        <Route exact path="/employee/:id" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

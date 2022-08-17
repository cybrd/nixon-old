import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';

export function EmployeeArchive() {
  return (
    <React.Fragment>
      <h3>Employee</h3>
      <Switch>
        <Route exact path="/employeeArchive" component={List} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

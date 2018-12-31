import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Create } from './Create';
import { Edit } from './Edit';

export function Payroll() {
  return (
    <React.Fragment>
      <h3>Payroll</h3>
      <Switch>
        <Route exact path="/payroll" component={List} />
        <Route exact path="/payroll/create" component={Create} />
        <Route exact path="/payroll/:id" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

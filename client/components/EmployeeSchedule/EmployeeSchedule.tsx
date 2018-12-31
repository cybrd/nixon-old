import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Create } from './Create';
import { Edit } from './Edit';

export function EmployeeSchedule() {
  return (
    <React.Fragment>
      <h3>Employee Schedule</h3>
      <Switch>
        <Route exact path="/employeeSchedule" component={List} />
        <Route exact path="/employeeSchedule/create" component={Create} />
        <Route exact path="/employeeSchedule/:id" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

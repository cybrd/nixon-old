import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';

export function TimesheetSchedule() {
  return (
    <React.Fragment>
      <h3>Timesheet Schedule</h3>
      <Switch>
        <Route exact path="/timesheetSchedule" component={List} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

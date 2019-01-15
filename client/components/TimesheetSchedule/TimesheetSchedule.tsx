import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Summary } from './Summary';

export function TimesheetSchedule() {
  return (
    <React.Fragment>
      <h3>Timesheet Schedule</h3>
      <Switch>
        <Route exact path="/timesheetSchedule" component={List} />
        <Route
          exact
          path="/timesheetSchedule/employee/:eid/payroll/:pid"
          component={List}
        />
        <Route exact path="/timesheetSchedule/employee/:eid" component={List} />
        <Route exact path="/timesheetSchedule/payroll/:pid" component={List} />
        <Route exact path="/timesheetSchedule/summary" component={Summary} />
        <Route
          exact
          path="/timesheetSchedule/summary/employee/:eid/payroll/:pid"
          component={Summary}
        />
        <Route
          exact
          path="/timesheetSchedule/summary/employee/:eid"
          component={Summary}
        />
        <Route
          exact
          path="/timesheetSchedule/summary/payroll/:pid"
          component={Summary}
        />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Summary } from './Summary';
import { LatesAbsents } from './LatesAbsents';
import { DailyAbsent } from './DailyAbsent';

export function TimesheetSchedule() {
  return (
    <React.Fragment>
      <h3>Timesheet Schedule</h3>
      <Switch>
        <Route exact path="/timesheetSchedule" component={List} />
        <Route exact path="/timesheetSummary" component={Summary} />
        <Route exact path="/latesAbsents" component={LatesAbsents} />
        <Route exact path="/dailyAbsent" component={DailyAbsent} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

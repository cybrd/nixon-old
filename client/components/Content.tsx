import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Login } from './Login';
import { ProtectedRoute, ProtectedAdminRoute } from './ProtectedRoute';

import { Home } from './Home';
import { NoMatch } from './NoMatch';
import { User } from './User/User';
import { Timesheet } from './Timesheet/Timesheet';
import { Employee } from './Employee/Employee';
import { Schedule } from './Schedule/Schedule';
import { Payroll } from './Payroll/Payroll';
import { EmployeeSchedule } from './EmployeeSchedule/EmployeeSchedule';
import { TimesheetSchedule } from './TimesheetSchedule/TimesheetSchedule';

export function Content() {
  return (
    <div id="content">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <ProtectedAdminRoute path="/user" component={User} />
        <ProtectedRoute path="/timesheet" component={Timesheet} />
        <ProtectedRoute path="/employee" component={Employee} />
        <ProtectedRoute path="/schedule" component={Schedule} />
        <ProtectedRoute path="/payroll" component={Payroll} />
        <ProtectedRoute path="/employeeSchedule" component={EmployeeSchedule} />
        <ProtectedRoute
          path="/timesheetSchedule"
          component={TimesheetSchedule}
        />
        <Route component={NoMatch} />
      </Switch>
    </div>
  );
}

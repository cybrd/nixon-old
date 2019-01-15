import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { Load } from './Load';
import { List } from './List';
import { Create } from './Create';
import { Edit } from './Edit';

export function Timesheet() {
  return (
    <React.Fragment>
      <h3>Timesheet</h3>
      <Switch>
        <Route exact path="/" component={List} />
        <Route exact path="/timesheet" component={List} />
        <Route exact path="/timesheet/create" component={Create} />
        <Route exact path="/timesheet/load" component={Load} />
        <Route exact path="/timesheet/employee/:eid" component={List} />
        <Route exact path="/timesheet/:id" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import { NoMatch } from '../NoMatch';
import { List } from './List';
import { Create } from './Create';
import { Edit } from './Edit';

export function Schedule() {
  return (
    <React.Fragment>
      <h3>Schedule</h3>
      <Switch>
        <Route exact path="/schedule" component={List} />
        <Route exact path="/schedule/create" component={Create} />
        <Route exact path="/schedule/:id" component={Edit} />
        <Route component={NoMatch} />
      </Switch>
    </React.Fragment>
  );
}

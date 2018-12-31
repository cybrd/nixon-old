import * as React from 'react';
import { useState } from 'react';

import { Table } from '../Helper/Table';

import { list } from '../../services/timesheetSchedule';

export function List() {
  const [data, setData] = useState(null);
  const headers = ['employeeId', 'timestamp', 'type'];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

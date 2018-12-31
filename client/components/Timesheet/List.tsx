import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { list } from '../../services/timesheet';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'fingerPrintId',
    ['timestamp', 'timestamp'],
    'type',
    ['remove', '/api/timesheet/{{ _id }}/remove']
  ];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/timesheet/create">Create New Time In/Out</Link>
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

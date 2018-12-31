import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { list } from '../../services/employee';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'fingerPrintId',
    'firstName',
    'lastName',
    ['edit', '/employee/{{ _id }}'],
    ['remove', '/api/employee/{{ _id }}/remove']
  ];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/employee/create">Create New Employee</Link>
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

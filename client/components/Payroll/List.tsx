import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { list } from '../../services/payroll';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'name',
    ['edit', '/payroll/{{ _id }}'],
    ['remove', '/api/payroll/{{ _id }}/remove']
  ];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/payroll/create">Create New Payroll</Link>
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

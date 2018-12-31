import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { list } from '../../services/schedule';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'name',
    'type',
    'startHour',
    'startMinute',
    'endHour',
    'endMinute',
    ['edit', '/schedule/{{ _id }}'],
    ['remove', '/api/schedule/{{ _id }}/remove']
  ];

  if (data == null) {
    (async () => {
      const tmp = await list();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/schedule/create">Create New Schedule</Link>
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

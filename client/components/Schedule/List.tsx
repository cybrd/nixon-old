import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/schedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'name',
      field: 'name'
    },
    {
      label: 'type',
      field: 'type'
    },
    {
      label: 'startHour',
      field: 'startHour'
    },
    {
      label: 'startMinute',
      field: 'startMinute'
    },
    {
      label: 'endHour',
      field: 'endHour'
    },
    {
      label: 'endMinute',
      field: 'endMinute'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/schedule/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/schedule/{{ _id }}/remove">
            {{ _id: value }}
          </Remove>
        </React.Fragment>
      )
    }
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
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

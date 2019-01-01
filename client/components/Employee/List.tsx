import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/employee';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'First Name',
      field: 'firstName'
    },
    {
      label: 'Last Name',
      field: 'lastName'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/employee/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/employee/{{ _id }}/remove">
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
      <Link to="/employee/create">Create New Employee</Link>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

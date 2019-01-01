import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/user';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Username',
      field: 'username'
    },
    {
      label: 'Role',
      field: 'role'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/user/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/user/{{ _id }}/remove">{{ _id: value }}</Remove>
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
      <Link to="/user/create">Create New User</Link>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

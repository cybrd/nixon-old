import * as React from 'react';
import { useState } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
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
          <Update view="/user/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/user/{{ _id }}/remove" data={{ _id: value }} />
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
      <ButtonLink to="/user/create" color="primary">
        Create New User
      </ButtonLink>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

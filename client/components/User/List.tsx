import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { list } from '../../services/user';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'username',
    'role',
    ['remove', '/api/user/{{ _id }}/remove']
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
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { MyFetchJSON } from '../../services/MyFetch';

export function List() {
  const [data, setData] = useState(null);
  const headers: String[] = ['username', 'role'];

  if (data == null) {
    (async () => {
      const tmp = await MyFetchJSON('/api/user/list', {});
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

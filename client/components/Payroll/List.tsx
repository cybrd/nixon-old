import * as React from 'react';
import { useState, useEffect } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/payroll';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Name',
      field: 'name'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/payroll/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/payroll/{{ _id }}/remove" data={{ _id: value }} />
        </React.Fragment>
      )
    }
  ];

  async function fetchData() {
    const tmp = await list();
    setData(tmp);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <ButtonLink to="/payroll/create" color="primary">
        Create New Payroll
      </ButtonLink>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

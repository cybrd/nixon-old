import * as React from 'react';
import { useState } from 'react';

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
          <Update view="/payroll/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/payroll/{{ _id }}/remove">{{ _id: value }}</Remove>
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
      <ButtonLink to="/payroll/create" color="primary">
        Create New Payroll
      </ButtonLink>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

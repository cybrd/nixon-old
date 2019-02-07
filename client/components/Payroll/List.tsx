import * as React from 'react';
import { useState, useEffect } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { RoleCheck } from '../Helper/RoleCheck';
import { list } from '../../services/payroll';

export function List() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      label: 'Name',
      field: 'name'
    },
    {
      label: 'Actions',
      field: '_id',
      show: RoleCheck('admin'),
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/payroll/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/payroll/{{ _id }}/remove" data={{ _id: value }} />
        </React.Fragment>
      )
    }
  ];

  async function fetchData() {
    setLoading(true);
    const tmp = await list();
    setData(tmp);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <ButtonLink to="/payroll/create" color="primary">
        Create New Payroll
      </ButtonLink>
      {data != null ? (
        <Table data={data} columns={columns} loading={loading} />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

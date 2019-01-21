import * as React from 'react';
import { useState, useEffect } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/employee';

export function List() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Name',
      field: 'name'
    },
    {
      label: 'Department',
      field: 'department'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/employee/{{ _id }}" data={{ _id: value }} />
          <Remove view="/api/employee/{{ _id }}/remove" data={{ _id: value }} />
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
      <ButtonLink to="/employee/create" color="primary">
        Create New Employee
      </ButtonLink>
      {data != null ? (
        <Table data={data} columns={columns} loading={loading} />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

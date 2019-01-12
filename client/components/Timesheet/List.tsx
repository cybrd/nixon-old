import * as React from 'react';
import { useState, useEffect } from 'react';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/timesheet';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Timestamp',
      field: 'timestamp',
      cell: (value: any) => new Date(value).toLocaleString()
    },
    {
      label: 'Type',
      field: 'type'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/timesheet/{{ _id }}" data={{ _id: value }} />
          <Remove
            view="/api/timesheet/{{ _id }}/remove"
            data={{ _id: value }}
          />
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
      <ButtonLink to="/timesheet/create" color="primary">
        Create New Time In/Out
      </ButtonLink>
      {data != null ? (
        <Table columns={columns} data={data} orderBy="timestamp" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

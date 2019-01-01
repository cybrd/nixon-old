import * as React from 'react';
import { useState } from 'react';

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
          <Update view="/timesheet/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/timesheet/{{ _id }}/remove">
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

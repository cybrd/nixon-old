import * as React from 'react';
import { useState } from 'react';

import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { list } from '../../services/timesheetSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Timestamp',
      field: 'timestamp'
    },
    {
      label: 'Type',
      field: 'type'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <Remove view="/api/timesheet/{{ _id }}/remove">{{ _id: value }}</Remove>
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
      {data != null && data.length ? (
        <Table data={data} columns={columns} />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

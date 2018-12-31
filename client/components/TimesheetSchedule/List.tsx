import * as React from 'react';
import { useState } from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Remove } from '../Helper/Remove';
import { list } from '../../services/timesheetSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      Header: 'Finger Print Id',
      accessor: 'fingerPrintId'
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp'
    },
    {
      Header: 'Type',
      accessor: 'type'
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: (props: any) => (
        <Remove view="/api/timesheet/{{ _id }}/remove">
          {{ _id: props.value }}
        </Remove>
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
        <ReactTable
          data={data}
          columns={columns}
          defaultPageSize={15}
          showPageSizeOptions={false}
          minRows={0}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

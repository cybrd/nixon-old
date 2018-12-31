import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/timesheet';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      Header: 'Finger Print Id',
      accessor: 'fingerPrintId'
    },
    {
      Header: 'Timestamp',
      accessor: 'timestamp',
      Cell: (props: any) => new Date(props.value).toLocaleString()
    },
    {
      Header: 'Type',
      accessor: 'type'
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: (props: any) => (
        <React.Fragment>
          <Update view="/timesheet/{{ _id }}">{{ _id: props.value }}</Update>
          <Remove view="/api/timesheet/{{ _id }}/remove">
            {{ _id: props.value }}
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
      <Link to="/timesheet/create">Create New Time In/Out</Link>
      {data != null ? (
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

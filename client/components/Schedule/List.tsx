import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/schedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      Header: 'name',
      accessor: 'name'
    },
    {
      Header: 'type',
      accessor: 'type'
    },
    {
      Header: 'startHour',
      accessor: 'startHour'
    },
    {
      Header: 'startMinute',
      accessor: 'startMinute'
    },
    {
      Header: 'endHour',
      accessor: 'endHour'
    },
    {
      Header: 'endMinute',
      accessor: 'endMinute'
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: (props: any) => (
        <React.Fragment>
          <Update view="/schedule/{{ _id }}">{{ _id: props.value }}</Update>
          <Remove view="/api/schedule/{{ _id }}/remove">
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
      <Link to="/schedule/create">Create New Schedule</Link>
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

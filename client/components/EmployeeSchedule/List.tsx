import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { listPopulated } from '../../services/employeeSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      Header: 'Finger Print Id',
      accessor: 'employeeId.fingerPrintId'
    },
    {
      Header: 'First Name',
      accessor: 'employeeId.firstName'
    },
    {
      Header: 'Last Name',
      accessor: 'employeeId.lastName'
    },
    {
      Header: 'Schedule Name',
      accessor: 'scheduleId.name'
    },
    {
      Header: 'Payroll Name',
      accessor: 'payrollId.name'
    },
    {
      Header: 'Date',
      accessor: 'date',
      Cell: (props: any) => new Date(props.value).toLocaleDateString()
    },
    {
      Header: 'Actions',
      accessor: '_id',
      Cell: (props: any) => (
        <React.Fragment>
          <Update view="/employeeSchedule/{{ _id }}">
            {{ _id: props.value }}
          </Update>
          <Remove view="/api/employeeSchedule/{{ _id }}/remove">
            {{ _id: props.value }}
          </Remove>
        </React.Fragment>
      )
    }
  ];

  if (data == null) {
    (async () => {
      const tmp = await listPopulated();
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/employeeSchedule/create">Create New Employee Schedule</Link>
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

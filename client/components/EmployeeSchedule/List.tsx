import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { listPopulated } from '../../services/employeeSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'employeeFingerPrintId'
    },
    {
      label: 'First Name',
      field: 'employeeFirstName'
    },
    {
      label: 'Last Name',
      field: 'employeeLastName'
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName'
    },
    {
      label: 'Payroll Name',
      field: 'payrollName'
    },
    {
      label: 'Date',
      field: 'date',
      cell: (value: any) => new Date(value).toLocaleDateString()
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/employeeSchedule/{{ _id }}">{{ _id: value }}</Update>
          <Remove view="/api/employeeSchedule/{{ _id }}/remove">
            {{ _id: value }}
          </Remove>
        </React.Fragment>
      )
    }
  ];

  if (data == null) {
    (async () => {
      const tmp = await listPopulated();
      tmp.forEach((x: any) => {
        if (x.employeeId) {
          x.employeeFingerPrintId = x.employeeId.fingerPrintId;
          x.employeeFirstName = x.employeeId.firstName;
          x.employeeLastName = x.employeeId.lastName;
        }
        if (x.scheduleId) {
          x.scheduleName = x.scheduleId.name;
        }
        if (x.payrollId) {
          x.payrollName = x.payrollId.name;
        }
      });
      setData(tmp);
    })();
  }

  return (
    <React.Fragment>
      <Link to="/employeeSchedule/create">Create New Employee Schedule</Link>
      {data != null ? <Table data={data} columns={columns} /> : 'Loading...'}
    </React.Fragment>
  );
}

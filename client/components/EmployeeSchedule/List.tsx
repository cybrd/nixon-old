import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '../Helper/Table';

import { listPopulated } from '../../services/employeeSchedule';

export function List() {
  const [data, setData] = useState(null);
  const headers = [
    'fingerPrintId',
    'firstName',
    'lastName',
    'scheduleName',
    'payrollName',
    ['date', 'date'],
    ['edit', '/employeeSchedule/{{ _id }}'],
    ['remove', '/api/employeeSchedule/{{ _id }}/remove']
  ];

  if (data == null) {
    (async () => {
      const tmp = await listPopulated();
      tmp.forEach((x: any) => {
        if (x.employeeId) {
          x.fingerPrintId = x.employeeId.fingerPrintId;
          x.firstName = x.employeeId.firstName;
          x.lastName = x.employeeId.lastName;
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
      {data != null ? <Table headers={headers}>{data}</Table> : 'Loading...'}
    </React.Fragment>
  );
}

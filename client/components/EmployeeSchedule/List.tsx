import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { listPopulated } from '../../services/employeeSchedule';

export function List() {
  const [data, setData] = useState(null);
  const columns = [
    {
      label: 'Employee',
      field: 'employeeId',
      cell: (value: string, rowData: any) => (
        <Update
          view="/employee/{{ _id }}"
          data={{ _id: rowData.employeeId._id }}
        >
          {rowData.employeeId.fingerPrintId +
            ' ' +
            rowData.employeeId.firstName +
            ' ' +
            rowData.employeeId.lastName}
        </Update>
      )
    },
    {
      label: 'Schedule Name',
      field: 'scheduleId',
      cell: (value: string, rowData: any) => (
        <Update
          view="/schedule/{{ _id }}"
          data={{ _id: rowData.scheduleId._id }}
        >
          {rowData.scheduleId.name}
        </Update>
      )
    },
    {
      label: 'Payroll Name',
      field: 'payrollId',
      cell: (value: string, rowData: any) => (
        <Update view="/payroll/{{ _id }}" data={{ _id: rowData.payrollId._id }}>
          {rowData.payrollId.name}
        </Update>
      )
    },
    {
      label: 'Date',
      field: 'date',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: string) => (
        <React.Fragment>
          <Update view="/employeeSchedule/{{ _id }}" data={{ _id: value }} />
          <Remove
            view="/api/employeeSchedule/{{ _id }}/remove"
            data={{ _id: value }}
          />
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
      <ButtonLink to="/employeeSchedule/create" color="primary">
        Create New Employee Schedule
      </ButtonLink>
      {data != null ? (
        <Table data={data} columns={columns} orderBy="date" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

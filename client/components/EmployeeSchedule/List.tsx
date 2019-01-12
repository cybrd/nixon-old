import * as React from 'react';
import { useState } from 'react';

import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import styled from 'styled-components';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { listPopulated } from '../../services/employeeSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';

export function List() {
  const [data, setData] = useState(null);
  const employeeId = useFormSelect('');
  const payrollId = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
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
      const tmp = await Promise.all([
        employeeList(),
        payrollList(),
        listPopulated()
      ]);

      setEmployeeOptions(tmp[0]);
      setPayrollOptions(tmp[1]);
      setData(tmp[2]);
    })();
  }

  function useFormSelect(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: any) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  const MyForm = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Employee</InputLabel>
          {employeeOptions != null ? (
            <Select {...employeeId}>
              {employeeOptions.map((x: any) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.fingerPrintId} - {x.firstName} {x.lastName}
                </MenuItem>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Payroll</InputLabel>
          {payrollOptions != null ? (
            <Select {...payrollId}>
              {payrollOptions.map((x: any) => (
                <MenuItem key={x._id} value={x._id}>
                  {x.name}
                </MenuItem>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
      </MyForm>
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

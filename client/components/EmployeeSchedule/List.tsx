import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import styled from 'styled-components';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { listPopulated } from '../../services/employeeSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';

export function List(props: any) {
  const [data, setData] = useState([]);
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
          {rowData.employeeId.fingerPrintId + ' ' + rowData.employeeId.name}
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

  async function fetchOptions() {
    const tmp = await Promise.all([employeeList(), payrollList()]);

    setEmployeeOptions(tmp[0]);
    setPayrollOptions(tmp[1]);

    if (props.match.params.eid) {
      employeeId.onChange({ target: { value: props.match.params.eid } });
    }

    if (props.match.params.pid) {
      payrollId.onChange({ target: { value: props.match.params.pid } });
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchData() {
    const args: any = {};
    let history = '';

    if (employeeId.value) {
      history += '/employee/' + employeeId.value;
      args.employeeId = employeeId.value;
    }
    if (payrollId.value) {
      history += '/payroll/' + payrollId.value;
      args.payrollId = payrollId.value;
    }

    const tmp = await listPopulated(args);
    setData(tmp);

    props.history.push('/employeeSchedule' + history);
  }

  const query = payrollId.value + employeeId.value;
  useEffect(
    () => {
      if (employeeOptions) {
        fetchData();
      }
    },
    [query]
  );

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
      <ButtonLink to="/employeeSchedule/create" color="primary">
        Create New Employee Schedule
      </ButtonLink>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeId}>
              <option value="" />
              {employeeOptions.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {x.fingerPrintId} - {x.name}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Select Payroll</InputLabel>
          {payrollOptions != null ? (
            <Select native {...payrollId}>
              <option value="" />
              {payrollOptions.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {x.name}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
      </MyForm>
      {data != null ? (
        <Table data={data} columns={columns} orderBy="date" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

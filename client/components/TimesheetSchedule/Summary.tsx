import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import styled from 'styled-components';

import { Table } from '../Helper/Table';
import { summary } from '../../services/timesheetSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';

export function Summary(props: any) {
  const [data, setData] = useState([]);
  const employeeId = useFormSelect('');
  const payrollId = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName'
    },
    {
      label: 'WorkDayTotal',
      field: 'payrollWorkDayTotal',
      cell: (value: number) => {
        value /= 1000;
        const hours = Math.floor(value / 60 / 60);
        value -= hours * 60 * 60;
        const minutes = Math.floor(value / 60);
        value -= minutes * 60;
        const seconds = value;

        const result: string[] = [];

        if (hours) {
          result.push(`${hours} hours`);
        }

        if (minutes) {
          result.push(`${minutes} minutes`);
        }

        if (seconds) {
          result.push(`${seconds} seconds`);
        }

        return result.join(' ');
      }
    },
    {
      label: 'WorkDayWorked',
      field: 'payrollWorkDayWorked',
      cell: (value: number) => {
        value /= 1000;
        const hours = Math.floor(value / 60 / 60);
        value -= hours * 60 * 60;
        const minutes = Math.floor(value / 60);
        value -= minutes * 60;
        const seconds = value;

        const result: string[] = [];

        if (hours) {
          result.push(`${hours} hours`);
        }

        if (minutes) {
          result.push(`${minutes} minutes`);
        }

        if (seconds) {
          result.push(`${seconds} seconds`);
        }

        return result.join(' ');
      }
    },
    {
      label: 'WorkDayMissing',
      field: 'payrollWorkDayTotal',
      cell: (value: number, rowData: any) => {
        value -= rowData.payrollWorkDayWorked;
        value /= 1000;
        const hours = Math.floor(value / 60 / 60);
        value -= hours * 60 * 60;
        const minutes = Math.floor(value / 60);
        value -= minutes * 60;
        const seconds = value;

        const result: string[] = [];

        if (hours) {
          result.push(`${hours} hours`);
        }

        if (minutes) {
          result.push(`${minutes} minutes`);
        }

        if (seconds) {
          result.push(`${seconds} seconds`);
        }

        return result.join(' ');
      }
    }
  ];

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

    const tmp = await summary(args);
    setData(tmp);

    props.history.push('/timesheetSchedule/summary' + history);
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

  const MyForm = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeId}>
              <option value="" />
              {employeeOptions.map((x: any) => (
                <option key={x._id} value={x._id}>
                  {x.fingerPrintId} - {x.firstName} {x.lastName}
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
        <Table data={data} columns={columns} orderBy="workDay" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { Table, readableTime } from '../Helper/Table';
import { list } from '../../services/timesheetSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';
import { list as scheduleList } from '../../services/schedule';

export function List(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeFilter = useFormSelect('');
  const payrollFilter = useFormSelect('');
  const scheduleFilter = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId',
      cell: (value: string, rowData: any) => value + ' ' + rowData.employeeName
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
      label: 'Work Day',
      field: 'workDay',
      cell: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      label: 'WorkDayTotal',
      field: 'workDayTotal',
      cell: readableTime
    },
    {
      label: 'WorkDayWorked',
      field: 'workDayWorked',
      cell: readableTime
    },
    {
      label: 'WorkDayMissing',
      field: 'workDayMissing',
      cell: readableTime
    },
    {
      label: 'Is Absent',
      field: 'isAbsent',
      cell: (value: string) => value && value.toString()
    },
    {
      label: 'Late Allowance',
      field: 'lateAllowance',
      cell: (value: string) => value && value.toString()
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
    const tmp = await Promise.all([
      employeeList(),
      payrollList(),
      scheduleList()
    ]);

    setEmployeeOptions(tmp[0]);
    setPayrollOptions(tmp[1]);
    setScheduleOptions(tmp[2]);

    const params = parse(props.location.search.substr(1));
    if (params.employeeId) {
      employeeFilter.onChange({ target: { value: params.employeeId } });
    }

    if (params.payrollId) {
      payrollFilter.onChange({ target: { value: params.payrollId } });
    }

    if (params.scheduleId) {
      scheduleFilter.onChange({ target: { value: params.scheduleId } });
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchData() {
    const args: any = {};
    const locationSearch: any = {};

    if (employeeFilter.value) {
      args.employeeId = employeeFilter.value;
      locationSearch.employeeId = employeeFilter.value;
    }

    if (payrollFilter.value) {
      args.payrollId = payrollFilter.value;
      locationSearch.payrollId = payrollFilter.value;
    }

    if (scheduleFilter.value) {
      args.scheduleId = scheduleFilter.value;
      locationSearch.scheduleId = scheduleFilter.value;
    }

    setLoading(true);
    const tmp = await list(args);
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/timesheetSchedule',
      search: Object.keys(locationSearch)
        .map(key => {
          return key + '=' + encodeURIComponent(locationSearch[key]);
        })
        .join('&')
    };

    props.history.push(location);
  }

  const query =
    'e' +
    employeeFilter.value +
    'p' +
    payrollFilter.value +
    's' +
    scheduleFilter.value;
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
    grid-template-columns: 1fr 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeFilter}>
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
            <Select native {...payrollFilter}>
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
        <FormControl fullWidth>
          <InputLabel>Select Schedule</InputLabel>
          {scheduleOptions != null ? (
            <Select native {...scheduleFilter}>
              <option value="" />
              {scheduleOptions.map((x: any) => (
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
        <Table
          data={data}
          columns={columns}
          orderBy="workDay"
          loading={loading}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { Table, readableTime } from '../Helper/Table';
import { RoleCheck } from '../Helper/RoleCheck';
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
  const departmentFilter = useFormSelect('');
  const handlerFilter = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [handlerOptions, setHandlerOptions] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Employee Name',
      field: 'employeeName'
    },
    {
      label: 'Schedule Name',
      field: 'scheduleName'
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
  const copycolumns = [
    'fingerPrintId',
    'employeeName',
    'scheduleName',
    'workDay',
    'workDayTotal',
    'workDayWorked',
    'workDayMissing',
    'isAbsent',
    'lateAllowance'
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

    const departments: string[] = [];
    const handlers: string[] = [];

    tmp[0].forEach((x: any) => {
      if (departments.indexOf(x.department) < 0) {
        departments.push(x.department);
      }
    });
    departments.sort();

    tmp[0].forEach((x: any) => {
      if (handlers.indexOf(x.handler) < 0) {
        handlers.push(x.handler);
      }
    });
    handlers.sort();

    setEmployeeOptions(tmp[0]);
    setPayrollOptions(tmp[1]);
    setScheduleOptions(tmp[2]);
    setDepartmentOptions(departments);
    setHandlerOptions(handlers);

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

    if (params.handler) {
      handlerFilter.onChange({ target: { value: params.handler } });
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

  async function fetchData() {
    const args: any = {};
    const locationSearch: any = {};
    args.secondary = {};

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

    if (departmentFilter.value) {
      args.secondary.department = departmentFilter.value;
      locationSearch.department = departmentFilter.value;
    }

    if (handlerFilter.value) {
      args.secondary.handler = handlerFilter.value;
      locationSearch.handler = handlerFilter.value;
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
    scheduleFilter.value +
    'd' +
    departmentFilter.value +
    'h' +
    handlerFilter.value;
  useEffect(() => {
    if (employeeOptions) {
      fetchData();
    }
  }, [query]);

  const MyForm2 = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  const MyForm3 = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <MyForm2>
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
      </MyForm2>
      <MyForm3>
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
        <FormControl fullWidth>
          <InputLabel>Select Department</InputLabel>
          {departmentOptions != null ? (
            <Select native {...departmentFilter}>
              <option value="" />
              {departmentOptions.map((x: any) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Select Handler</InputLabel>
          {handlerOptions != null ? (
            <Select native {...handlerFilter}>
              <option value="" />
              {handlerOptions.map((x: any) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Select>
          ) : (
            'Loading...'
          )}
        </FormControl>
      </MyForm3>
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="workDay"
          order="desc"
          loading={loading}
          copycolumns={copycolumns}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { Table, readableTime, readableTimeDecimal } from '../Helper/Table';
import { RoleCheck } from '../Helper/RoleCheck';
import { summary } from '../../services/timesheetSchedule';
import { list as employeeList } from '../../services/employee';
import { list as payrollList } from '../../services/payroll';

export function Summary(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const employeeFilter = useFormSelect('');
  const payrollFilter = useFormSelect('');
  const departmentFilter = useFormSelect('');
  const handlerFilter = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [handlerOptions, setHandlerOptions] = useState(null);
  const startDate = useFormInput('');
  const endDate = useFormInput('');

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
      label: 'Payroll Name',
      field: 'payrollName'
    },
    {
      label: 'WorkDayTotal',
      field: 'payrollWorkDayTotal',
      cell: readableTime
    },
    {
      label: 'WorkDayWorked',
      field: 'payrollWorkDayWorked',
      cell: readableTime
    },
    {
      label: 'WorkOvertime',
      field: 'payrollWorkOvertime',
      cell: readableTime
    },
    {
      label: 'WorkSunday',
      field: 'payrollWorkSunday',
      cell: readableTime
    },
    {
      label: 'WorkHoliday',
      field: 'payrollWorkHoliday',
      cell: readableTime
    },
    {
      label: '# Late',
      field: 'payrollIsLate'
    },
    {
      label: '# Is Absent',
      field: 'payrollIsAbsent'
    },
    {
      field: 'payrollWorkDayTotalDecimal',
      cell: (value: string, rowData: any) =>
        readableTimeDecimal(rowData.payrollWorkDayTotal),
      show: false
    },
    {
      field: 'payrollWorkDayWorkedDecimal',
      cell: (value: string, rowData: any) =>
        readableTimeDecimal(rowData.payrollWorkDayWorked),
      show: false
    },
    {
      field: 'payrollWorkOvertimeDecimal',
      cell: (value: string, rowData: any) =>
        readableTimeDecimal(rowData.payrollWorkOvertime),
      show: false
    },
    {
      field: 'payrollWorkSundayDecimal',
      cell: (value: string, rowData: any) =>
        readableTimeDecimal(rowData.payrollWorkSunday),
      show: false
    },
    {
      field: 'payrollWorkHolidayDecimal',
      cell: (value: string, rowData: any) =>
        readableTimeDecimal(rowData.payrollWorkHoliday),
      show: false
    },
    {
      label: 'Department',
      field: 'department',
      show: false
    }
  ];
  let copycolumns: any = [];
  if (RoleCheck('admin')) {
    copycolumns = [
      'fingerPrintId',
      'employeeName',
      'payrollName',
      'payrollWorkDayTotal',
      'payrollWorkDayTotalDecimal',
      'payrollWorkDayWorked',
      'payrollWorkDayWorkedDecimal',
      'payrollWorkOvertime',
      'payrollWorkOvertimeDecimal',
      'payrollWorkSunday',
      'payrollWorkSundayDecimal',
      'payrollWorkHoliday',
      'payrollWorkHolidayDecimal',
      'payrollIsLate',
      'payrollIsAbsent',
      'department'
    ];
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

  function useFormInput(initialValue: string) {
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
    setDepartmentOptions(departments);
    setHandlerOptions(handlers);

    const params = parse(props.location.search.substr(1));
    if (params.employeeId) {
      employeeFilter.onChange({ target: { value: params.employeeId } });
    }

    if (params.payrollId) {
      payrollFilter.onChange({ target: { value: params.payrollId } });
    }

    if (params.handler) {
      handlerFilter.onChange({ target: { value: params.handler } });
    }

    if (params.startDate) {
      startDate.onChange({ target: { value: params.startDate } });
    }

    if (params.endDate) {
      endDate.onChange({ target: { value: params.endDate } });
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

    if (departmentFilter.value) {
      args.secondary.department = departmentFilter.value;
      locationSearch.department = departmentFilter.value;
    }

    if (handlerFilter.value) {
      args.secondary.handler = handlerFilter.value;
      locationSearch.handler = handlerFilter.value;
    }

    if (startDate.value) {
      if (!args.date) {
        args.date = {};
      }

      args.date.$gte = `${startDate.value} 00:00:00`;
      locationSearch.startDate = startDate.value;
    }

    if (endDate.value) {
      if (!args.date) {
        args.date = {};
      }

      args.date.$lte = `${endDate.value} 23:59:59`;
      locationSearch.endDate = endDate.value;
    }

    setLoading(true);
    const tmp = await summary(args);
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/timesheetSummary',
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
    'd' +
    departmentFilter.value +
    'h' +
    handlerFilter.value +
    'h' +
    startDate.value +
    'd' +
    endDate.value;

  useEffect(() => {
    if (employeeOptions) {
      const timer = setTimeout(fetchData, 50);
      return () => clearTimeout(timer);
    }
  }, [query]);

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
      </MyForm>
      <MyForm>
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
      </MyForm>
      <MyForm>
        <FormControl fullWidth>
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            {...startDate}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            {...endDate}
          />
        </FormControl>
      </MyForm>
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="payrollIsAbsent"
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

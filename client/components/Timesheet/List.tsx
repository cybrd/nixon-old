import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { RoleCheckX } from '../Helper/RoleCheck';
import { list, removeMany } from '../../services/timesheet';
import { list as employeeList } from '../../services/employee';

export function List(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const [handlerOptions, setHandlerOptions] = useState(null);
  const employeeFilter = useFormSelect('');
  const departmentFilter = useFormSelect('');
  const typeFilter = useFormSelect('');
  const handlerFilter = useFormSelect('');
  const startDate = useFormInput('');
  const endDate = useFormInput('');

  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Employee Name',
      field: 'employeeName',
      cell: (value: string, rowData: any) => rowData.employee.name
    },
    {
      label: 'Timestamp',
      field: 'timestamp',
      cell: (value: any) => new Date(value).toLocaleString()
    },
    {
      label: 'Type',
      field: 'type'
    },
    {
      label: 'Actions',
      field: '_id',
      cell: (value: any) => (
        <React.Fragment>
          <Update view="/timesheet/{{ _id }}" data={{ _id: value }} />

          <Remove
            view="/api/timesheet/{{ _id }}/remove"
            data={{ _id: value }}
          />
        </React.Fragment>
      )
    },
    {
      field: 'timestampDate',
      cell: (value: any, rowData: any) =>
        new Date(rowData.timestamp).toLocaleDateString(),
      show: false
    },
    {
      field: 'timestampTime',
      cell: (value: any, rowData: any) =>
        new Date(rowData.timestamp).toLocaleTimeString(),
      show: false
    }
  ];

  const copyColumns = [
    'fingerPrintId',
    'employeeName',
    'timestampDate',
    'timestampTime',
    'type'
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
    const tmp = await employeeList();
    const departments: string[] = [];
    const handlers: string[] = [];

    tmp.forEach((x: any) => {
      if (departments.indexOf(x.department) < 0) {
        departments.push(x.department);
      }
    });
    departments.sort();

    tmp.forEach((x: any) => {
      if (handlers.indexOf(x.handler) < 0) {
        handlers.push(x.handler);
      }
    });
    handlers.sort();

    setEmployeeOptions(tmp);
    setDepartmentOptions(departments);
    setHandlerOptions(handlers);

    const params = parse(props.location.search.substr(1));
    if (params.fingerPrintId) {
      employeeFilter.onChange({ target: { value: params.fingerPrintId } });
    }

    if (params.department) {
      departmentFilter.onChange({ target: { value: params.department } });
    }

    if (params.type) {
      typeFilter.onChange({ target: { value: params.type } });
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
      args.fingerPrintId = employeeFilter.value;
      locationSearch.fingerPrintId = employeeFilter.value;
    }

    if (departmentFilter.value) {
      args.secondary.department = departmentFilter.value;
      locationSearch.department = departmentFilter.value;
    }

    if (typeFilter.value) {
      args.type = typeFilter.value;
      locationSearch.type = typeFilter.value;
    }

    if (handlerFilter.value) {
      args.secondary.handler = handlerFilter.value;
      locationSearch.handler = handlerFilter.value;
    }

    if (startDate.value) {
      if (!args.timestamp) {
        args.timestamp = {};
      }

      args.timestamp.$gte = `${startDate.value} 00:00:00`;
      locationSearch.startDate = startDate.value;
    }

    if (endDate.value) {
      if (!args.timestamp) {
        args.timestamp = {};
      }

      args.timestamp.$lte = `${endDate.value} 23:59:59`;
      locationSearch.endDate = endDate.value;
    }

    setLoading(true);
    const tmp = await list(args);
    setData(tmp);
    setLoading(false);

    const location = {
      pathname: '/timesheet',
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
    'd' +
    departmentFilter.value +
    't' +
    typeFilter.value +
    's' +
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
      <RoleCheckX>
        <ButtonLink to="/timesheet/create" color="primary">
          Create New Time In/Out
        </ButtonLink>
      </RoleCheckX>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeFilter}>
              <option value="" />
              {employeeOptions.map((x: any) => (
                <option key={x._id} value={x.fingerPrintId}>
                  {x.fingerPrintId} - {x.name}
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
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Type</InputLabel>
          <Select native {...typeFilter}>
            <option value="" />
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </Select>
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
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="timestamp"
          order="desc"
          loading={loading}
          copycolumns={copyColumns}
          removeFn={removeMany}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

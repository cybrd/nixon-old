import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { parse } from 'qs';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/timesheet';
import { list as employeeList } from '../../services/employee';

export function List(props: any) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [departmentOptions, setDepartmentOptions] = useState(null);
  const employeeFilter = useFormSelect('');
  const departmentFilter = useFormSelect('');
  const typeFilter = useFormSelect('');
  const startDate = useFormInput('');
  const endDate = useFormInput('');

  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
    },
    {
      label: 'Employee Name',
      field: 'fingerPrintId',
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
    tmp.forEach((x: any) => {
      if (departments.indexOf(x.department) < 0) {
        departments.push(x.department);
      }
    });

    setEmployeeOptions(tmp);
    setDepartmentOptions(departments);

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

    if (startDate.value) {
      if (!args.timestamp) {
        args.timestamp = {};
      }

      args.timestamp.$gte = startDate.value;
      locationSearch.startDate = startDate.value;
    }

    if (endDate.value) {
      if (!args.timestamp) {
        args.timestamp = {};
      }

      args.timestamp.$lte = endDate.value;
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
    startDate.value +
    'd' +
    endDate.value;
  useEffect(
    () => {
      if (employeeOptions) {
        const timer = setTimeout(fetchData, 50);
        return () => clearTimeout(timer);
      }
    },
    [query]
  );

  const MyForm3 = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  `;

  const MyForm2 = styled.form`
    min-width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
  `;

  return (
    <React.Fragment>
      <ButtonLink to="/timesheet/create" color="primary">
        Create New Time In/Out
      </ButtonLink>
      <MyForm3>
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
        <FormControl fullWidth>
          <InputLabel>Select Type</InputLabel>
          <Select native {...typeFilter}>
            <option value="" />
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
          </Select>
        </FormControl>
      </MyForm3>
      <MyForm2>
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
      </MyForm2>
      {data != null ? (
        <Table
          data={data}
          columns={columns}
          orderBy="timestamp"
          order="desc"
          loading={loading}
        />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

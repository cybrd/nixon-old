import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import styled from 'styled-components';

import { ButtonLink } from '../Helper/ButtonLink';
import { Table } from '../Helper/Table';
import { Remove } from '../Helper/Remove';
import { Update } from '../Helper/Update';
import { list } from '../../services/timesheet';
import { list as employeeList } from '../../services/employee';

export function List(props: any) {
  const [data, setData] = useState([]);
  const employeeId = useFormSelect('');
  const [employeeOptions, setEmployeeOptions] = useState(null);
  const columns = [
    {
      label: 'Finger Print Id',
      field: 'fingerPrintId'
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

  async function fetchOptions() {
    const tmp = await employeeList();

    setEmployeeOptions(tmp);

    if (props.match.params.eid) {
      employeeId.onChange({ target: { value: props.match.params.eid } });
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
      args.fingerPrintId = employeeId.value;
    }

    const tmp = await list(args);
    setData(tmp);

    props.history.push('/timesheet' + history);
  }

  const query = employeeId.value;
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
      <ButtonLink to="/timesheet/create" color="primary">
        Create New Time In/Out
      </ButtonLink>
      <MyForm>
        <FormControl fullWidth>
          <InputLabel>Select Employee</InputLabel>
          {employeeOptions != null ? (
            <Select native {...employeeId}>
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
      </MyForm>
      {data != null ? (
        <Table data={data} columns={columns} orderBy="timestamp" order="desc" />
      ) : (
        'Loading...'
      )}
    </React.Fragment>
  );
}

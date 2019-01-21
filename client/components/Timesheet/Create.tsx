import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  TextField,
  InputLabel,
  Select
} from '@material-ui/core';

import { list as employeeList } from '../../services/employee';
import { create } from '../../services/timesheet';

export function Create() {
  const fingerPrintId = useFormSelect('');
  const date = useFormInput('');
  const hour = useFormSelect('0');
  const minute = useFormSelect('0');
  const type = useFormSelect('IN');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState(null);

  function useFormInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
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

  async function fetchData() {
    const tmp = await employeeList();
    setEmployeeOptions(tmp);
    fingerPrintId.onChange({ target: { value: tmp[0].fingerPrintId } });
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const data = {
      fingerPrintId: fingerPrintId.value,
      date: date.value,
      hour: hour.value,
      minute: minute.value,
      type: type.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    let history = '';

    if (fingerPrintId.value) {
      history += '/employee/' + fingerPrintId.value;
    }

    return <Redirect to={'/timesheet' + history} />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth required>
        <InputLabel>Finger Print Id</InputLabel>
        {employeeOptions != null ? (
          <Select native {...fingerPrintId}>
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
      <FormControl fullWidth required>
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          {...date}
        />
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Start Hour</InputLabel>
        <Select native {...hour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <option key={i.toString().concat('hour')} value={i.toString()}>
              {i.toString()}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Start Minute</InputLabel>
        <Select native {...minute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <option
              key={i.toString().concat('startMinute')}
              value={i.toString()}
            >
              {i.toString()}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Type</InputLabel>
        <Select native {...type}>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

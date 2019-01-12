import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

import { list as employeeList } from '../../services/employee';
import { list, update } from '../../services/timesheet';

export function Edit(props: any) {
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

    function handleChange(e: any) {
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

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const tmp = {
      fingerPrintId: fingerPrintId.value,
      date: date.value,
      hour: hour.value,
      minute: minute.value,
      type: type.value
    };

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/timesheet" />;
  }

  async function fetchData() {
    const tmp = await Promise.all([
      employeeList(),
      list({ _id: props.match.params.id })
    ]);
    setEmployeeOptions(tmp[0]);

    fingerPrintId.onChange({ target: { value: tmp[1][0].fingerPrintId } });
    date.onChange({
      target: {
        value: new Date(tmp[1][0].timestamp).toISOString().substr(0, 10)
      }
    });
    hour.onChange({
      target: { value: new Date(tmp[1][0].timestamp).getHours() }
    });
    minute.onChange({
      target: { value: new Date(tmp[1][0].timestamp).getMinutes() }
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth required>
        <InputLabel>Finger Print Id</InputLabel>
        {employeeOptions != null ? (
          <Select {...fingerPrintId}>
            {employeeOptions.map((x: any) => (
              <MenuItem key={x._id} value={x.fingerPrintId}>
                {x.fingerPrintId} - {x.firstName} {x.lastName}
              </MenuItem>
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
        <Select {...hour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <MenuItem key={i.toString().concat('hour')} value={i.toString()}>
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Start Minute</InputLabel>
        <Select {...minute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <MenuItem
              key={i.toString().concat('startMinute')}
              value={i.toString()}
            >
              {i.toString()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Type</InputLabel>
        <Select {...type}>
          <MenuItem value="IN">IN</MenuItem>
          <MenuItem value="OUT">OUT</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

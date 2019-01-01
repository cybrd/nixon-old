import * as React from 'react';
import { useState } from 'react';
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
import { list as scheduleList } from '../../services/schedule';
import { list as payrollList } from '../../services/payroll';
import { create } from '../../services/employeeSchedule';

export function Create() {
  const employeeId = useFormSelect('');
  const scheduleId = useFormSelect('');
  const payrollId = useFormSelect('');
  const date = useFormInput('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);

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

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const data = {
      employeeId: employeeId.value,
      scheduleId: scheduleId.value,
      payrollId: payrollId.value,
      date: date.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employeeSchedule" />;
  }

  if (employeeOptions == null) {
    (async () => {
      const tmp = await Promise.all([
        employeeList(),
        scheduleList(),
        payrollList()
      ]);
      setEmployeeOptions(tmp[0]);
      setScheduleOptions(tmp[1]);
      setPayrollOptions(tmp[2]);

      employeeId.onChange({ target: { value: tmp[0][0]._id } });
      scheduleId.onChange({ target: { value: tmp[1][0]._id } });
      payrollId.onChange({ target: { value: tmp[2][0]._id } });
    })();
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth>
        <InputLabel>Employee</InputLabel>
        {employeeOptions != null ? (
          <Select {...employeeId}>
            {employeeOptions.map((x: any) => (
              <MenuItem key={x._id} value={x._id}>
                {x.fingerPrintId} - {x.firstName} {x.lastName}
              </MenuItem>
            ))}
          </Select>
        ) : (
          'Loading...'
        )}
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Schedule</InputLabel>
        {scheduleOptions != null ? (
          <Select {...scheduleId}>
            {scheduleOptions.map((x: any) => (
              <MenuItem key={x._id} value={x._id}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          'Loading...'
        )}
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Payroll</InputLabel>
        {payrollOptions != null ? (
          <Select {...payrollId}>
            {payrollOptions.map((x: any) => (
              <MenuItem key={x._id} value={x._id}>
                {x.name}
              </MenuItem>
            ))}
          </Select>
        ) : (
          'Loading...'
        )}
      </FormControl>
      <FormControl fullWidth>
        <TextField
          label="Date"
          type="date"
          InputLabelProps={{
            shrink: true
          }}
          {...date}
        />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

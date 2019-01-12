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
import { list as scheduleList } from '../../services/schedule';
import { list as payrollList } from '../../services/payroll';
import { list, update } from '../../services/employeeSchedule';

export function Edit(props: any) {
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
      employeeId: employeeId.value,
      scheduleId: scheduleId.value,
      payrollId: payrollId.value,
      date: date.value
    };

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employeeSchedule" />;
  }

  async function fetchData() {
    const tmp = await Promise.all([
      employeeList(),
      scheduleList(),
      payrollList(),
      list({ _id: props.match.params.id })
    ]);
    setEmployeeOptions(tmp[0]);
    setScheduleOptions(tmp[1]);
    setPayrollOptions(tmp[2]);

    employeeId.onChange({ target: { value: tmp[3][0].employeeId } });
    scheduleId.onChange({ target: { value: tmp[3][0].scheduleId } });
    payrollId.onChange({ target: { value: tmp[3][0].payrollId } });
    date.onChange({
      target: { value: new Date(tmp[3][0].date).toISOString().substr(0, 10) }
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth required>
        <InputLabel>Employee</InputLabel>
        {employeeOptions != null ? (
          <Select native {...employeeId}>
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
      <FormControl fullWidth required>
        <InputLabel>Schedule</InputLabel>
        {scheduleOptions != null ? (
          <Select native {...scheduleId}>
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
      <FormControl fullWidth required>
        <InputLabel>Payroll</InputLabel>
        {payrollOptions != null ? (
          <Select native {...payrollId}>
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
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

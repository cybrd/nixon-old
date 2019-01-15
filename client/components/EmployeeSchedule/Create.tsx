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

import { FormControlWithRemove } from '../Helper/FormControlWithRemove';
import { list as employeeList } from '../../services/employee';
import { list as scheduleList } from '../../services/schedule';
import { list as payrollList } from '../../services/payroll';
import { create } from '../../services/employeeSchedule';

export function Create() {
  const employeeId = useFormSelect('');
  const scheduleId = useFormSelect('');
  const payrollId = useFormSelect('');
  const [done, setDone] = useState(false);
  const [dates, setDates] = useState([new Date().toISOString().substr(0, 10)]);
  const [error, setError] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);

  function handleDatesChange(i: number) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      dates[i] = e.target.value;
      setDates(dates);
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

  function addDate() {
    if (dates.length) {
      const newDate = new Date(dates[dates.length - 1]);
      newDate.setDate(newDate.getDate() + 1);

      dates.push(newDate.toISOString().substr(0, 10));
    } else {
      dates.push(new Date().toISOString().substr(0, 10));
    }

    setDates(dates);
  }

  function removeDate(i: number) {
    return () => {
      dates.splice(i, 1);
      setDates(dates);
    };
  }

  async function fetchData() {
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
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleFormSubmit(e: any) {
    e.preventDefault();

    const data = {
      employeeId: employeeId.value,
      scheduleId: scheduleId.value,
      payrollId: payrollId.value,
      dates: dates
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

    if (employeeId.value) {
      history += '/employee/' + employeeId.value;
    }

    if (payrollId.value) {
      history += '/payroll/' + payrollId.value;
    }

    return <Redirect to={'/employeeSchedule' + history} />;
  }

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

      {dates.map((date, i) => (
        <FormControlWithRemove
          fullWidth
          required
          key={'dates' + i}
          remove={removeDate(i)}
        >
          <TextField
            label="Date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            value={date}
            onChange={handleDatesChange(i)}
          />
        </FormControlWithRemove>
      ))}

      <p>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={addDate}
        >
          Add date
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </p>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

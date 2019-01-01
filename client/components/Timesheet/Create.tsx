import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { list as employeeList } from '../../services/employee';
import { create } from '../../services/timesheet';

export function Create() {
  const currDate = new Date();
  const fingerPrintId = useFormSelect('');
  const hour = useFormSelect('0');
  const minute = useFormSelect('0');
  const type = useFormSelect('IN');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [date, setDate] = useState(null);

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
      fingerPrintId: fingerPrintId.value,
      date: date,
      hour: hour.value,
      minute: minute.value,
      type: type.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/timesheet" />;
  }

  if (employeeOptions == null) {
    (async () => {
      const tmp = await employeeList();
      setEmployeeOptions(tmp);
      fingerPrintId.onChange({ target: { value: tmp[0].fingerPrintId } });
    })();
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Finger Print Id
        {employeeOptions != null ? (
          <select {...fingerPrintId}>
            {employeeOptions.map((x: any) => (
              <option key={x._id} value={x.fingerPrintId}>
                {x.fingerPrintId} - {x.firstName} {x.lastName}
              </option>
            ))}
          </select>
        ) : (
          'Loading...'
        )}
      </p>
      <div>
        Date
        <Datepicker
          selected={date}
          onChange={setDate}
          showMonthYearDropdown
          minDate={new Date(currDate.getFullYear(), currDate.getMonth() - 6)}
          maxDate={new Date(currDate.getFullYear(), currDate.getMonth() + 1)}
        />
      </div>
      <p>
        Start Hour
        <select {...hour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <option key={i.toString().concat('hour')}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        Start Minute
        <select {...minute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <option key={i.toString().concat('minute')}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        Type
        <select {...type}>
          <option>IN</option>
          <option>OUT</option>
        </select>
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

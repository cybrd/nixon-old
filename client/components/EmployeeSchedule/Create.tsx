import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Datepicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { list as employeeList } from '../../services/employee';
import { list as scheduleList } from '../../services/schedule';
import { list as payrollList } from '../../services/payroll';
import { create } from '../../services/employeeSchedule';

export function Create() {
  const employeeId = useFormSelect('');
  const scheduleId = useFormSelect('');
  const payrollId = useFormSelect('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState(null);
  const [scheduleOptions, setScheduleOptions] = useState(null);
  const [payrollOptions, setPayrollOptions] = useState(null);
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
      employeeId: employeeId.value,
      scheduleId: scheduleId.value,
      payrollId: payrollId.value,
      date: date
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(true);
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
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Employee
        {employeeOptions != null ? (
          <select {...employeeId}>
            {employeeOptions.map((x: any) => (
              <option key={x._id} value={x._id}>
                {x.fingerPrintId} - {x.firstName} {x.lastName}
              </option>
            ))}
          </select>
        ) : (
          'Loading...'
        )}
      </p>
      <p>
        Schedule
        {scheduleOptions != null ? (
          <select {...scheduleId}>
            {scheduleOptions.map((x: any) => (
              <option key={x._id} value={x._id}>
                {x.name}
              </option>
            ))}
          </select>
        ) : (
          'Loading...'
        )}
      </p>
      <p>
        Payroll
        {payrollOptions != null ? (
          <select {...payrollId}>
            {payrollOptions.map((x: any) => (
              <option key={x._id} value={x._id}>
                {x.name}
              </option>
            ))}
          </select>
        ) : (
          'Loading...'
        )}
      </p>
      <div>
        Date
        <Datepicker selected={date} onChange={setDate} />
      </div>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

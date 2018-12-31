import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { create } from '../../services/schedule';

export function Create() {
  const name = useFormInput('');
  const startHour = useFormSelect('0');
  const startMinute = useFormSelect('0');
  const endHour = useFormSelect('0');
  const endMinute = useFormSelect('0');
  const type = useFormSelect('regular');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

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

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
      setValue(e.target.value);
    }

    return {
      value: value,
      onChange: handleChange
    };
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      name: name.value,
      startHour: startHour.value,
      startMinute: startMinute.value,
      endHour: endHour.value,
      endMinute: endMinute.value,
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
    return <Redirect to="/schedule" />;
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Name
        <input type="text" {...name} />
      </p>
      <p>
        Start Hour
        <select {...startHour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        Start Minute
        <select {...startMinute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        End Hour
        <select {...endHour}>
          {Array.apply(0, Array(24)).map((x: any, i: number) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        End Minute
        <select {...endMinute}>
          {Array.apply(0, Array(60)).map((x: any, i: number) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </p>
      <p>
        Type
        <select {...type}>
          <option>regular</option>
          <option>overtime</option>
        </select>
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

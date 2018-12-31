import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { create } from '../../services/employee';

export function Create() {
  const fingerPrintId = useFormInput('');
  const firstName = useFormInput('');
  const lastName = useFormInput('');
  const department = useFormInput('');
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

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = {
      fingerPrintId: fingerPrintId.value,
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employee" />;
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Finger Print Id
        <input type="text" {...fingerPrintId} />
      </p>
      <p>
        First Name
        <input type="text" {...firstName} />
      </p>
      <p>
        Last Name
        <input type="text" {...lastName} />
      </p>
      <p>
        Department
        <input type="text" {...department} />
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

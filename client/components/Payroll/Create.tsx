import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { create } from '../../services/payroll';

export function Create() {
  const name = useFormInput('');
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
      name: name.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/payroll" />;
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Name
        <input type="text" {...name} />
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

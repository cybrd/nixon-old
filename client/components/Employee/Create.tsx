import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { FormControl, Button, Input, InputLabel } from '@material-ui/core';

import { create } from '../../services/employee';

export function Create() {
  const fingerPrintId = useFormInput('');
  const name = useFormInput('');
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
      name: name.value,
      department: department.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employee" />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth required>
        <InputLabel>Finger Print Id</InputLabel>
        <Input {...fingerPrintId} />
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Name</InputLabel>
        <Input {...name} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Department</InputLabel>
        <Input {...department} />
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

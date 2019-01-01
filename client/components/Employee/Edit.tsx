import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { FormControl, Button, Input, InputLabel } from '@material-ui/core';

import { update, list } from '../../services/employee';

export function Edit(props: any) {
  const [data, setData] = useState(null);
  const fingerPrintId = useFormInput('');
  const firstName = useFormInput('');
  const lastName = useFormInput('');
  const department = useFormInput('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

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

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tmp = {
      fingerPrintId: fingerPrintId.value,
      firstName: firstName.value,
      lastName: lastName.value,
      department: department.value
    };

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/employee" />;
  }

  if (data == null) {
    (async () => {
      const tmp = await list({ _id: props.match.params.id });
      setData(tmp[0]);
      fingerPrintId.onChange({ target: { value: tmp[0].fingerPrintId } });
      firstName.onChange({ target: { value: tmp[0].firstName } });
      lastName.onChange({ target: { value: tmp[0].lastName } });
      department.onChange({ target: { value: tmp[0].department } });
    })();
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth>
        <InputLabel>Finger Print Id</InputLabel>
        <Input {...fingerPrintId} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>First Name</InputLabel>
        <Input {...firstName} />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>Last Name</InputLabel>
        <Input {...lastName} />
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

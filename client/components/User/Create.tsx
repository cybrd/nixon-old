import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  InputLabel,
  Input,
  Select
} from '@material-ui/core';

import { create } from '../../services/user';

export function Create() {
  const username = useFormInput('');
  const password = useFormInput('');
  const role = useFormSelect('user');
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
      username: username.value,
      password: password.value,
      role: role.value
    };

    const result = await create(data);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/user" />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl fullWidth required>
        <InputLabel>Username</InputLabel>
        <Input {...username} />
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Password</InputLabel>
        <Input type="password" {...password} />
      </FormControl>
      <FormControl fullWidth required>
        <InputLabel>Role</InputLabel>
        <Select native {...role}>
          <option value="admin">admin</option>
          <option value="supervisor">supervisor</option>
          <option value="user">user</option>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import {
  FormControl,
  Button,
  InputLabel,
  Input,
  Select
} from '@material-ui/core';

import { list, update } from '../../services/user';

export function Edit(props: any) {
  const [data, setData] = useState(null);
  const username = useFormInput('');
  const password = useFormInput('');
  const role = useFormSelect('user');
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

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const tmp: any = {
      username: username.value,
      role: role.value
    };

    if (password.value) {
      tmp.password = password.value;
    }

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/user" />;
  }

  async function fetchData() {
    const tmp = await list({ _id: props.match.params.id });
    setData(tmp[0]);
    username.onChange({ target: { value: tmp[0].username } });
    password.onChange({ target: { value: '' } });
    role.onChange({ target: { value: tmp[0].role } });
  }

  useEffect(() => {
    fetchData();
  }, []);

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

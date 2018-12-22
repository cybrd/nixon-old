import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { userCreate } from '../../services/User';

export function Create() {
  const username = useFormInput('');
  const password = useFormInput('');
  const [role, setRole] = useState('user');
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
    const result = await userCreate(username.value, password.value, role);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setRole(e.target.value);
  }

  if (done) {
    return <Redirect to="/user" />;
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <input type="text" name="username" {...username} />
      <input type="password" name="password" {...password} />
      <select name="role" onChange={handleRoleChange} value={role}>
        <option>admin</option>
        <option>supervisor</option>
        <option>user</option>
      </select>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

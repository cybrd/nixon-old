import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { list, update } from '../../services/user';

export function Edit(props: any) {
  const [data, setData] = useState(null);
  const username = useFormInput('');
  const password = useFormInput('');
  const [role, setRole] = useState('user');
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

    const tmp: any = {
      username: username.value,
      role: role
    };

    if (password.value) {
      tmp.password = password.value;
    }

    const result = await update(props.match.params.id, tmp);
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

  if (data == null) {
    (async () => {
      const tmp = await list({ _id: props.match.params.id });
      setData(tmp[0]);
      username.onChange({ target: { value: tmp[0].username } });
      password.onChange({ target: { value: '' } });
      setRole(tmp[0].role);
    })();
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Username
        <input type="text" {...username} />
      </p>
      <p>
        Password
        <input type="password" {...password} />
      </p>
      <p>
        Role
        <select onChange={handleRoleChange} value={role}>
          <option>admin</option>
          <option>supervisor</option>
          <option>user</option>
        </select>
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

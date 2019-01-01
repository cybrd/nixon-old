import * as React from 'react';
import { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

export function Login() {
  const username = useFormInput('');
  const password = useFormInput('');
  const authContext = useContext(AuthContext);

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

  function handleFormSubmit(login: Function) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      login(username.value, password.value);
    };
  }

  if (authContext.role) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleFormSubmit(authContext.login)}>
      <input type="text" name="username" {...username} />
      <input type="password" name="password" {...password} />
      <input type="submit" />
      {authContext.formLoginError && <p>Login error</p>}
    </form>
  );
}

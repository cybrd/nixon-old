import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { upload } from '../../services/timesheet';

export function Load() {
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await upload(file);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  if (done) {
    return <Redirect to="/timesheet" />;
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <input type="file" onChange={handleChange} />
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

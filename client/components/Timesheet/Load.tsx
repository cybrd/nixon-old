import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { upload } from '../../services/timesheet';

export function Load() {
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files[0]);
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await upload(file);
    if (result.errmsg) {
      setError(result.errmsg);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/timesheet" />;
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="file" onChange={handleChange} />
      <input type="submit" />
      {error && <p>Create error: {error}</p>}
    </form>
  );
}

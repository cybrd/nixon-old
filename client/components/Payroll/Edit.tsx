import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { update, list } from '../../services/payroll';

export function Edit(props: any) {
  const [data, setData] = useState(null);
  const name = useFormInput('');
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
      name: name.value
    };

    const result = await update(props.match.params.id, tmp);
    if (result.errmsg) {
      setError(true);
    } else {
      setDone(true);
    }
  }

  if (done) {
    return <Redirect to="/payroll" />;
  }

  if (data == null) {
    (async () => {
      const tmp = await list({ _id: props.match.params.id });
      setData(tmp[0]);
      name.onChange({ target: { value: tmp[0].name } });
    })();
  }

  return (
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Finger Print Id
        <input type="text" {...name} />
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}

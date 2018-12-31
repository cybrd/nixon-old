import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

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
      setError(true);
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
    <form onSubmit={handleFormSubmit} method="POST">
      <p>
        Finger Print Id
        <input type="text" {...fingerPrintId} />
      </p>
      <p>
        First Name
        <input type="text" {...firstName} />
      </p>
      <p>
        Last Name
        <input type="text" {...lastName} />
      </p>
      <p>
        Department
        <input type="text" {...department} />
      </p>
      <input type="submit" />
      {error && <p>Create error</p>}
    </form>
  );
}
